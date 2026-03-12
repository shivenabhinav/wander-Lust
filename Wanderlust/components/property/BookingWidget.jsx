"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { CheckCircle, Download, FileText, MapPin, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function BookingWidget({ property }) {
  const { data: session } = useSession();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isFirstBooking, setIsFirstBooking] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [error, setError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Receipt State
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 0);
  }, [checkIn, checkOut]);

  const totalPrice = nights * property.pricePerNight;

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/booking-status?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setIsFirstBooking(data.isFirstBooking))
        .catch(() => setIsFirstBooking(true));
    }
  }, [session]);

  useEffect(() => {
    setFinalAmount(totalPrice - discount);
  }, [totalPrice, discount]);

  useEffect(() => {
    if (nights > 0) {
      fetch("/api/coupons/available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: totalPrice, nights, category: property.category, isFirstBooking }),
      })
        .then(res => res.json())
        .then(data => setAvailableCoupons(data.coupons || []));
    }
  }, [nights, totalPrice, isFirstBooking, property.category]);

  const applyCoupon = async () => {
    setError("");
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, totalAmount: totalPrice, nights, category: property.category, isFirstBooking }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setIsCouponApplied(false);
      setError(data.error || "Invalid coupon");
      return;
    }
    setDiscount(data.discount);
    setFinalAmount(data.finalAmount);
    setIsCouponApplied(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 } });
  };

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || session?.user?.id;
    if (userId && property._id) {
      fetch(`/api/wishlist/${userId}`)
        .then(res => res.json())
        .then(data => {
          const isIncluded = Array.isArray(data) && data.some(p => p._id === property._id);
          setIsWishlisted(isIncluded);
        })
        .catch(err => console.error("Wishlist check error:", err));
    }
  }, [session, property._id]);

  const handleAddToWishlist = async () => {
    const userId = localStorage.getItem("userId") || session?.user?.id;
    if (!userId) return alert("Please login to save properties");

    if (isWishlisted) return; // Already saved

    try {
      const res = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, propertyId: property._id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsWishlisted(true);
        confetti({ particleCount: 50, spread: 40, origin: { x: 0.9, x: 1 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const payAndBook = async () => {
    if (!window.Razorpay) return alert("Gateway loading...");
    if (!checkIn || !checkOut) return alert("Please select dates");

    setProcessing(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          user: localStorage.getItem("userId") || session?.user?.id || "guest",
          checkIn,
          checkOut,
          amount: finalAmount
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Booking creation failed: " + (data.message || "Unknown error"));
        setProcessing(false);
        return;
      }

      const { order, bookingId } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Wanderlust",
        description: `Booking for ${property.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify & Complete
            const verifyRes = await fetch("/api/bookings/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: bookingId,
                razorpayPaymentId: response.razorpay_payment_id
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
              setReceipt(verifyData.receipt);
              setShowReceipt(true);
            } else {
              alert("Payment verification failed: " + verifyData.error);
            }
          } catch (err) {
            console.error(err);
            alert("Verification Error");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: session?.user?.name || "Guest User",
          email: session?.user?.email || "guest@example.com",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        setProcessing(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl w-full max-w-[380px] border border-gray-100 flex flex-col gap-6 font-sans">
        {/* Price Header */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price per night</p>
          <h3 className="text-2xl font-black text-black tracking-tight">₹{property.pricePerNight}</h3>
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Check-In</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="border border-gray-200 bg-gray-50 p-3 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Check-Out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="border border-gray-200 bg-gray-50 p-3 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-[#f4faff] rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Original Total</span>
            <span>₹{totalPrice}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs font-bold text-green-600">
              <span>🎉 Coupon Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-black border-t border-blue-100 pt-3 text-black">
            <span>Final Amount</span>
            <span>₹{finalAmount}</span>
          </div>
        </div>

        {/* Coupon Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="COUPON CODE"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className={`w-full border-2 border-dashed p-4 rounded-xl text-[10px] font-black tracking-[0.2em] outline-none transition-all ${isCouponApplied ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 focus:border-blue-600'}`}
          />
          <button onClick={applyCoupon} className={`absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-lg text-[9px] font-black tracking-widest transition-all ${isCouponApplied ? 'bg-green-600 text-white' : 'bg-black text-white'}`}>
            {isCouponApplied ? "APPLIED" : "APPLY"}
          </button>
        </div>

        {/* RECTIFIED AVAILABLE OFFERS SECTION */}
        <div className="flex flex-col gap-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">Available Offers</p>

          <div className="max-h-[260px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {availableCoupons.map((c) => (
              <div
                key={c.code}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer group shadow-sm ${c.eligible
                  ? 'border-green-100 bg-white hover:border-green-400'
                  : 'border-gray-100 bg-gray-50/50 opacity-100 grayscale-0'
                  }`}
                onClick={() => c.eligible && setCouponCode(c.code)}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className={`font-bold text-xs ${c.eligible ? 'text-black' : 'text-gray-500'}`}>{c.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${c.eligible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'
                    }`}>{c.code}</span>
                </div>
                <p className={`text-[9px] font-medium leading-relaxed ${c.eligible ? 'text-gray-500' : 'text-gray-400'}`}>
                  {c.description}
                </p>

                {/* CLEAR ERROR MESSAGES */}
                {!c.eligible && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
                    {c.reasons?.map((r, i) => (
                      <p key={i} className="text-[8px] text-red-500 font-extrabold italic uppercase tracking-tight">✕ {r}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={payAndBook}
            disabled={processing || !checkIn || !checkOut}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-[0.15em] text-[10px] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Pay & Confirm Booking"}
          </button>

          <button
            onClick={handleAddToWishlist}
            className={`px-4 rounded-xl border-2 transition-all flex items-center justify-center ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}</style>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-6 text-center text-white relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-emerald-100 text-sm">Your payment has been verified</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</span>
                <span className="font-mono text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{receipt.transactionId}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Property</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white text-right max-w-[200px]">{receipt.propertyTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{receipt.stayCheckIn} - {receipt.stayCheckOut}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nights</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{receipt.nights} nights</span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center text-lg font-black text-gray-900 dark:text-white">
                    <span>Total Paid</span>
                    <span className="text-emerald-600">₹{receipt.financials.totalAmount}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">
                    * 75% (₹{receipt.financials.hostPayout}) allocated to Host, 25% (₹{receipt.financials.platformFee}) platform fee included.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full mt-6 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
              >
                Close & Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}