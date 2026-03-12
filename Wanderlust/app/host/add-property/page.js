// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import { Trash2, X } from "lucide-react";

// // export default function AddPropertyPage() {
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     pricePerNight: "",
// //     address: "",
// //     latitude: "",
// //     longitude: "",
// //     amenities: [],
// //     maxGuests: "",
// //     images: [],
// //     keywords: [],
// //     propertyType: "", // ⭐ NEW
// //     isFeatured: false,
// //     bedrooms: 1,
// //     bathrooms: 1,
// //     size: 0,
// //     blockedDates: [],
// //     blockedStart: "",
// //     blockedEnd: "",
// //   });

// //   const [newKeyword, setNewKeyword] = useState("");
// //   const [previewImages, setPreviewImages] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [uploading, setUploading] = useState(false);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;

// //     if (type === "checkbox") {
// //       setFormData((prev) => ({
// //         ...prev,
// //         amenities: checked
// //           ? [...prev.amenities, value]
// //           : prev.amenities.filter((a) => a !== value),
// //       }));
// //     } else {
// //       setFormData({ ...formData, [name]: value });
// //     }
// //   };

// //   const handleAddKeyword = () => {
// //     if (!newKeyword.trim()) return;

// //     setFormData((prev) => ({
// //       ...prev,
// //       keywords: [...prev.keywords, newKeyword.trim()],
// //     }));

// //     setNewKeyword("");
// //   };

// //   const handleRemoveKeyword = (index) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       keywords: prev.keywords.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const handleImageUpload = async (e) => {
// //     const files = Array.from(e.target.files);
// //     if (!files.length) return;

// //     setUploading(true);
// //     const uploaded = [];

// //     for (const file of files) {
// //       const fd = new FormData();
// //       fd.append("file", file);

// //       const res = await fetch("/api/upload", {
// //         method: "POST",
// //         body: fd,
// //       });

// //       const data = await res.json();
// //       uploaded.push(data.url);
// //     }

// //     setUploading(false);

// //     setFormData((prev) => ({
// //       ...prev,
// //       images: [...prev.images, ...uploaded],
// //     }));

// //     setPreviewImages((prev) => [...prev, ...uploaded]);
// //   };

// //   const handleDeleteImage = (index) => {
// //     setPreviewImages((prev) => prev.filter((_, i) => i !== index));
// //     setFormData((prev) => ({
// //       ...prev,
// //       images: prev.images.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const hostId = localStorage.getItem("userId");
// //     if (!hostId) {
// //       alert("Please log in first.");
// //       setLoading(false);
// //       return;
// //     }

// //     const propertyData = {
// //       ...formData,
// //       pricePerNight: Number(formData.pricePerNight),
// //       maxGuests: Number(formData.maxGuests),
// //       location: {
// //         type: "Point",
// //         coordinates: [
// //           parseFloat(formData.longitude),
// //           parseFloat(formData.latitude),
// //         ],
// //         address: formData.address,
// //       },
// //       hostId,
// //     };

// //     const res = await fetch("/api/properties/add", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(propertyData),
// //     });

// //     const data = await res.json();
// //     setLoading(false);

// //     if (res.ok) {
// //       alert("Property added!");

// //       setFormData({
// //         title: "",
// //         description: "",
// //         pricePerNight: "",
// //         address: "",
// //         latitude: "",
// //         longitude: "",
// //         amenities: [],
// //         maxGuests: "",
// //         images: [],
// //         keywords: [],
// //         propertyType: "",
// //       });

// //       setPreviewImages([]);
// //     } else {
// //       alert("Failed: " + data.message);
// //     }
// //   };

// //   return (
// //     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-3xl mx-auto my-8">
// //       <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
// //         🏡 Add New Property
// //       </h1>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Title */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Title
// //           </label>
// //           <input
// //             type="text"
// //             name="title"
// //             required
// //             value={formData.title}
// //             onChange={handleChange}
// //             placeholder="Cozy Beach Villa"
// //             className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //           />
// //         </div>

// //         {/* Description */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Description
// //           </label>
// //           <textarea
// //             name="description"
// //             rows="4"
// //             required
// //             value={formData.description}
// //             onChange={handleChange}
// //             placeholder="Describe your property..."
// //             className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //           />
// //         </div>

// //         {/* ⭐ PROPERTY TYPE */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Property Type
// //           </label>

// //           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //             {[
// //               { name: "Apartment", icon: "🏢" },
// //               { name: "House", icon: "🏠" },
// //               { name: "Private Room", icon: "🛏️" },
// //               { name: "Hotel", icon: "🏨" },
// //               { name: "Hostel", icon: "⛺" },
// //               { name: "Guest House", icon: "🏘️" },
// //               { name: "Studio Apartment", icon: "🏬" },
// //               { name: "Resort", icon: "🌴" },
// //               { name: "Cottage", icon: "🏡" },
// //               { name: "Serviced Apartment", icon: "🏙️" },
// //               { name: "Other" },
// //             ].map((type) => (
// //               <label
// //                 key={type.name}
// //                 className="flex items-center gap-2 cursor-pointer dark:text-gray-200"
// //               >
// //                 <input
// //                   type="radio"
// //                   name="propertyType"
// //                   value={type.name}
// //                   checked={formData.propertyType === type.name}
// //                   onChange={handleChange}
// //                   className="h-4 w-4"
// //                 />
// //                 <span className="text-xl">{type.icon}</span>
// //                 <span>{type.name}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </div>
// //         {/* ⭐ FEATURED PROPERTY SECTION */}
// //         <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
// //           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
// //             Feature This Property
// //           </h3>

// //           <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
// //             Featured properties appear at the top of search results, get
// //             highlighted in listings, and usually receive more views & bookings.
// //           </p>

// //           <label className="flex items-center gap-3 cursor-pointer dark:text-gray-200">
// //             <input
// //               type="checkbox"
// //               name="isFeatured"
// //               checked={formData.isFeatured}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, isFeatured: e.target.checked })
// //               }
// //               className="h-4 w-4"
// //             />
// //             <span className="font-medium">Yes, feature this property</span>
// //           </label>
// //         </div>

// //         {/* ⭐ KEYWORDS SECTION */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Keywords / Tags (optional)
// //           </label>

// //           <div className="flex gap-2">
// //             <input
// //               type="text"
// //               value={newKeyword}
// //               onChange={(e) => setNewKeyword(e.target.value)}
// //               placeholder="e.g., beach, sunset view"
// //               className="flex-grow px-4 py-2 border border-gray-300 rounded-lg 
// //               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //             <button
// //               type="button"
// //               onClick={handleAddKeyword}
// //               className="px-4 py-2 bg-blue-600 text-white rounded-lg 
// //               hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
// //             >
// //               Add
// //             </button>
// //           </div>

// //           <div className="flex flex-wrap gap-2 mt-3">
// //             {formData.keywords.map((word, index) => (
// //               <span
// //                 key={index}
// //                 className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 
// //                 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full"
// //               >
// //                 {word}
// //                 <button onClick={() => handleRemoveKeyword(index)}>
// //                   <X size={14} className="text-red-500 hover:text-red-700" />
// //                 </button>
// //               </span>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Price + Guests */}
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Price per Night (₹)
// //             </label>
// //             <input
// //               type="number"
// //               name="pricePerNight"
// //               required
// //               value={formData.pricePerNight}
// //               onChange={handleChange}
// //               placeholder="4500"
//               // className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               // dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Max Guests
// //             </label>
// //             <input
// //               type="number"
// //               name="maxGuests"
// //               required
// //               value={formData.maxGuests}
// //               onChange={handleChange}
// //               placeholder="6"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>
// //         </div>
// //         {/* ⭐ Bedrooms, Bathrooms, Size */}
// //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //           {/* Bedrooms */}
// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Bedrooms
// //             </label>
// //             <input
// //               type="number"
// //               name="bedrooms"
// //               min="0"
// //               value={formData.bedrooms || ""}
// //               onChange={handleChange}
// //               placeholder="e.g., 2"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>

// //           {/* Bathrooms */}
// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Bathrooms
// //             </label>
// //             <input
// //               type="number"
// //               name="bathrooms"
// //               min="0"
// //               value={formData.bathrooms || ""}
// //               onChange={handleChange}
// //               placeholder="e.g., 1"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>

// //           {/* Size */}
// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Property Size (sq ft)
// //             </label>
// //             <input
// //               type="number"
// //               name="size"
// //               min="0"
// //               value={formData.size || ""}
// //               onChange={handleChange}
// //               placeholder="e.g., 1200"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>
// //         </div>

// //         {/* Address */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Address
// //           </label>
// //           <input
// //             type="text"
// //             name="address"
// //             required
// //             value={formData.address}
// //             onChange={handleChange}
// //             placeholder="123 Beach Road, Goa"
// //             className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //           />
// //         </div>

// //         {/* Coordinates */}
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Latitude
// //             </label>
// //             <input
// //               type="number"
// //               step="any"
// //               name="latitude"
// //               required
// //               value={formData.latitude}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //               Longitude
// //             </label>
// //             <input
// //               type="number"
// //               step="any"
// //               name="longitude"
// //               required
// //               value={formData.longitude}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
// //               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //             />
// //           </div>
// //         </div>
// //         {/* ⭐ BLOCKED DATES SECTION */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Blocked Dates (Unavailable for Booking)
// //           </label>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
// //             <div>
// //               <label className="text-sm text-gray-600 dark:text-gray-400">
// //                 Start Date
// //               </label>
// //               <input
// //                 type="date"
// //                 name="blockedStart"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg 
// //         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, blockedStart: e.target.value })
// //                 }
// //                 value={formData.blockedStart || ""}
// //               />
// //             </div>

// //             <div>
// //               <label className="text-sm text-gray-600 dark:text-gray-400">
// //                 End Date
// //               </label>
// //               <input
// //                 type="date"
// //                 name="blockedEnd"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg 
// //         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, blockedEnd: e.target.value })
// //                 }
// //                 value={formData.blockedEnd || ""}
// //               />
// //             </div>

// //             <button
// //               type="button"
// //               onClick={() => {
// //                 if (!formData.blockedStart || !formData.blockedEnd) {
// //                   alert("Please select both start & end dates");
// //                   return;
// //                 }

// //                 const newRange = {
// //                   start: formData.blockedStart,
// //                   end: formData.blockedEnd,
// //                 };

// //                 setFormData({
// //                   ...formData,
// //                   blockedDates: [...(formData.blockedDates || []), newRange],
// //                   blockedStart: "",
// //                   blockedEnd: "",
// //                 });
// //               }}
// //               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
// //       dark:bg-blue-500 dark:hover:bg-blue-600"
// //             >
// //               Add
// //             </button>
// //           </div>

// //           {/* ⭐ Display Blocked Date List */}
// //           <div className="mt-3 space-y-2">
// //             {(formData.blockedDates || []).map((range, index) => (
// //               <div
// //                 key={index}
// //                 className="flex justify-between items-center bg-gray-100 
// //         dark:bg-gray-700 p-3 rounded-lg"
// //               >
// //                 <span className="dark:text-white">
// //                   {range.start} → {range.end}
// //                 </span>

// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     const updated = [...formData.blockedDates];
// //                     updated.splice(index, 1);
// //                     setFormData({ ...formData, blockedDates: updated });
// //                   }}
// //                   className="text-red-500 hover:text-red-700"
// //                 >
// //                   Remove
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Amenities */}
// //         <div>
// //           <span className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Amenities
// //           </span>

// //           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //             {["WiFi", "Parking", "Pool", "Kitchen", "AC", "TV"].map((item) => (
// //               <label
// //                 key={item}
// //                 className="flex items-center gap-2 dark:text-gray-300"
// //               >
// //                 <input
// //                   type="checkbox"
// //                   value={item}
// //                   checked={formData.amenities.includes(item)}
// //                   onChange={handleChange}
// //                 />
// //                 {item}
// //               </label>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Image Upload */}
// //         <div>
// //           <label className="block text-gray-700 dark:text-gray-300 mb-2">
// //             Upload Images
// //           </label>

// //           <input
// //             type="file"
// //             multiple
// //             accept="image/*"
// //             onChange={handleImageUpload}
// //             className="block w-full text-sm text-gray-500 dark:text-gray-400 
// //             file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 file:rounded-lg"
// //           />

// //           {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

// //           {previewImages.length > 0 && (
// //             <div className="mt-3 flex gap-3 flex-wrap">
// //               {previewImages.map((src, i) => (
// //                 <div
// //                   key={i}
// //                   className="relative w-28 h-20 rounded-lg overflow-hidden shadow-md"
// //                 >
// //                   <button
// //                     type="button"
// //                     onClick={() => handleDeleteImage(i)}
// //                     className="absolute top-1 right-1 z-20 bg-black/70 p-1 rounded-full hover:bg-black"
// //                   >
// //                     <Trash2 size={14} className="text-red-400" />
// //                   </button>

// //                   <Image
// //                     src={src}
// //                     alt="Preview"
// //                     fill
// //                     className="object-cover"
// //                     unoptimized
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Submit */}
// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium 
// //           hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
// //         >
// //           {loading ? "Adding Property..." : "Add Property"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Trash2, X } from "lucide-react";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function AddPropertyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const isEdit = searchParams.get("edit") === "true";

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     pricePerNight: "",
//     address: "",
//     latitude: "",
//     longitude: "",
//     amenities: [],
//     maxGuests: "",
//     images: [],
//     keywords: [],
//     propertyType: "",
//     isFeatured: false,
//     bedrooms: 1,
//     bathrooms: 1,
//     size: 0,
//     blockedDates: [],
//     blockedStart: "",
//     blockedEnd: "",
//   });

//   const [newKeyword, setNewKeyword] = useState("");
//   const [previewImages, setPreviewImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   // ⭐ Load Edit Mode Property
//   useEffect(() => {
//     if (isEdit) {
//       const saved = localStorage.getItem("editProperty");
//       if (saved) {
//         const property = JSON.parse(saved);

//         setFormData({
//           title: property.title || "",
//           description: property.description || "",
//           pricePerNight: property.pricePerNight || "",
//           address: property.location?.address || "",
//           latitude: property.location?.coordinates?.[1] || "",
//           longitude: property.location?.coordinates?.[0] || "",
//           amenities: property.amenities || [],
//           maxGuests: property.maxGuests || "",
//           images: property.images || [],
//           keywords: property.keywords || [],
//           propertyType: property.propertyType || "",
//           isFeatured: property.isFeatured || false,
//           bedrooms: property.bedrooms || 1,
//           bathrooms: property.bathrooms || 1,
//           size: property.size || 0,
//           blockedDates: (property.blockedDates || []).map((d) => ({
//             start: d.start?.slice(0, 10),
//             end: d.end?.slice(0, 10),
//           })),
//           blockedStart: "",
//           blockedEnd: "",
//         });

//         setPreviewImages(property.images || []);
//       }
//     }
//   }, [isEdit]);

//   // ⭐ Handle Change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         amenities: checked
//           ? [...prev.amenities, value]
//           : prev.amenities.filter((a) => a !== value),
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // ⭐ Keywords
//   const handleAddKeyword = () => {
//     if (!newKeyword.trim()) return;
//     setFormData((prev) => ({
//       ...prev,
//       keywords: [...prev.keywords, newKeyword.trim()],
//     }));
//     setNewKeyword("");
//   };
//   const handleRemoveKeyword = (i) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, idx) => idx !== i),
//     }));
//   };

//   // ⭐ Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const hostId = localStorage.getItem("userId");
//     if (!hostId) {
//       alert("Please log in first.");
//       setLoading(false);
//       return;
//     }

//     const propertyData = {
//       ...formData,
//       pricePerNight: Number(formData.pricePerNight),
//       maxGuests: Number(formData.maxGuests),
//       size: Number(formData.size),
//       bedrooms: Number(formData.bedrooms),
//       bathrooms: Number(formData.bathrooms),
//       location: {
//         type: "Point",
//         coordinates: [
//           parseFloat(formData.longitude),
//           parseFloat(formData.latitude),
//         ],
//         address: formData.address,
//       },
//       hostId,
//     };

//     let res;
//     if (isEdit) {
//       const old = JSON.parse(localStorage.getItem("editProperty"));
//       res = await fetch(`/api/properties/${old._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(propertyData),
//       });
//     } else {
//       res = await fetch("/api/properties/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(propertyData),
//       });
//     }

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       alert(isEdit ? "Updated Successfully!" : "Property Added!");
//       localStorage.removeItem("editProperty");
//       router.push("/host/properties");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-3xl mx-auto my-8">
//       <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
//         {isEdit ? "✏️ Edit Property" : "🏡 Add New Property"}
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* ========================= */}
//         {/* ⭐ TITLE */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Title
//           </label>
//           <input
//             type="text"
//             name="title"
//             required
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//         </div>

//         {/* ========================= */}
//         {/* ⭐ DESCRIPTION */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Description
//           </label>
//           <textarea
//             name="description"
//             rows="4"
//             required
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//         </div>

//         {/* ========================= */}
//         {/* ⭐ PROPERTY TYPE */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Property Type
//           </label>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {[
//               "Apartment",
//               "House",
//               "Private Room",
//               "Hotel",
//               "Hostel",
//               "Guest House",
//               "Studio Apartment",
//               "Resort",
//               "Cottage",
//               "Serviced Apartment",
//               "Other",
//             ].map((type) => (
//               <label
//                 key={type}
//                 className="flex items-center gap-2 cursor-pointer dark:text-gray-200"
//               >
//                 <input
//                   type="radio"
//                   name="propertyType"
//                   value={type}
//                   checked={formData.propertyType === type}
//                   onChange={handleChange}
//                 />
//                 {type}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ FEATURED */}
//         {/* ========================= */}
//         {/* <div className="border p-4 rounded-lg dark:border-gray-600 dark:bg-gray-700">
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isFeatured"
//               checked={formData.isFeatured}
//               onChange={(e) =>
//                 setFormData({ ...formData, isFeatured: e.target.checked })
//               }
//             />
//             <span className="text-gray-800 dark:text-gray-200">
//               Feature this property
//             </span>
//           </label>
//         </div> */}
//         <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
//             Feature This Property
//           </h3>

//           <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
//             Featured properties appear at the top of search results, get
//             highlighted in listings, and usually receive more views & bookings.
//           </p>

//           <label className="flex items-center gap-3 cursor-pointer dark:text-gray-200">
//             <input
//               type="checkbox"
//               name="isFeatured"
//               checked={formData.isFeatured}
//               onChange={(e) =>
//                 setFormData({ ...formData, isFeatured: e.target.checked })
//               }
//               className="h-4 w-4"
//             />
//             <span className="font-medium">Yes, feature this property</span>
//           </label>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ KEYWORDS */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">
//             Keywords
//           </label>

//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newKeyword}
//               onChange={(e) => setNewKeyword(e.target.value)}
//               className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//             <button
//               type="button"
//               onClick={handleAddKeyword}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Add
//             </button>
//           </div>

//           <div className="mt-3 flex gap-2 flex-wrap">
//             {formData.keywords.map((word, i) => (
//               <span
//                 key={i}
//                 className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-200"
//               >
//                 {word}
//                 <button onClick={() => handleRemoveKeyword(i)}>
//                   <X size={14} className="text-red-500" />
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ PRICE + GUESTS */}
//         {/* ========================= */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-2  text-gray-700 dark:text-gray-300">Price Per Night</label>
//             <input
//               type="number"
//               name="pricePerNight"
//               value={formData.pricePerNight}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>

//           <div>
//             <label className="block mb-2  text-gray-700 dark:text-gray-300">Max Guests</label>
//             <input
//               type="number"
//               name="maxGuests"
//               value={formData.maxGuests}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ BEDROOMS / BATHROOMS / SIZE */}
//         {/* ========================= */}
//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block mb-2 text-gray-700 dark:text-gray-300">Bedrooms</label>
//             <input
//               type="number"
//               name="bedrooms"
//               value={formData.bedrooms}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-gray-700 dark:text-gray-300">Bathrooms</label>
//             <input
//               type="number"
//               name="bathrooms"
//               value={formData.bathrooms}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-gray-700 dark:text-gray-300">Size (sq ft)</label>
//             <input
//               type="number"
//               name="size"
//               value={formData.size}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ ADDRESS */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2  text-gray-700 dark:text-gray-300">Address</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//         </div>

//         {/* ========================= */}
//         {/* ⭐ LAT / LNG */}
//         {/* ========================= */}
//         <div className="grid grid-cols-2 gap-4 ">
//           <div>
//             <label className="block mb-2  text-gray-700 dark:text-gray-300">Latitude</label>
//             <input
//               type="number"
//               name="latitude"
//               value={formData.latitude}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-2  text-gray-700 dark:text-gray-300">Longitude</label>
//             <input
//               type="number"
//               name="longitude"
//               value={formData.longitude}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ BLOCKED DATES */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2 text-gray-700 dark:text-gray-300">Blocked Dates</label>

//           <div className="grid grid-cols-3 gap-3 items-end">
//             <input
//               type="date"
//               name="blockedStart"
//               value={formData.blockedStart}
//               onChange={(e) =>
//                 setFormData({ ...formData, blockedStart: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />

//             <input
//               type="date"
//               name="blockedEnd"
//               value={formData.blockedEnd}
//               onChange={(e) =>
//                 setFormData({ ...formData, blockedEnd: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg 
//               dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />

//             <button
//               type="button"
//               onClick={() => {
//                 if (!formData.blockedStart || !formData.blockedEnd) {
//                   alert("Select both dates");
//                   return;
//                 }

//                 setFormData({
//                   ...formData,
//                   blockedDates: [
//                     ...formData.blockedDates,
//                     {
//                       start: formData.blockedStart,
//                       end: formData.blockedEnd,
//                     },
//                   ],
//                   blockedStart: "",
//                   blockedEnd: "",
//                 });
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Add
//             </button>
//           </div>

//           {/* ⭐ List */}
//           <div className="mt-3 space-y-2">
//             {formData.blockedDates.map((range, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded"
//               >
//                 <span>
//                   {range.start} → {range.end}
//                 </span>
//                 <button
//                   onClick={() => {
//                     const arr = [...formData.blockedDates];
//                     arr.splice(i, 1);
//                     setFormData({ ...formData, blockedDates: arr });
//                   }}
//                 >
//                   ❌
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ AMENITIES */}
//         {/* ========================= */}
//         <div>
//           <label className="block mb-2  text-gray-700 dark:text-gray-300">Amenities</label>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {["WiFi", "Parking", "Pool", "Kitchen", "AC", "TV"].map((item) => (
//               <label key={item} className="flex items-center gap-2 block mb-2  text-gray-700 dark:text-gray-300">
//                 <input
//                   type="checkbox"
//                   value={item}
//                   checked={formData.amenities.includes(item)}
//                   onChange={handleChange}
//                 />
//                 {item}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* ========================= */}
//         {/* ⭐ IMAGE UPLOAD */}
//         {/* ========================= */}
//         {/* <div>
//           <label className="block mb-2  text-gray-700 dark:text-gray-300">Upload Images</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="block w-full"
//           />

//           {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

//           <div className="mt-3 flex flex-wrap gap-3">
//             {previewImages.map((src, i) => (
//               <div key={i} className="relative w-28 h-20 rounded-lg overflow-hidden">
//                 <button
//                   type="button"
//                   onClick={() => handleDeleteImage(i)}
//                   className="absolute top-1 right-1 bg-black/50 p-1 rounded"
//                 >
//                   <Trash2 size={14} className="text-red-400" />
//                 </button>

//                 <Image
//                   src={src}
//                   alt="Preview"
//                   fill
//                   className="object-cover"
//                   unoptimized
//                 />
//               </div>
//             ))}
//           </div>
//         </div> */}
//         <div>
//           <label className="block text-gray-700 dark:text-gray-300 mb-2">
//             Upload Images
//           </label>

//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="block w-full text-sm text-gray-500 dark:text-gray-400 
//             file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 file:rounded-lg"
//           />

//           {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

//           {previewImages.length > 0 && (
//             <div className="mt-3 flex gap-3 flex-wrap">
//               {previewImages.map((src, i) => (
//                 <div
//                   key={i}
//                   className="relative w-28 h-20 rounded-lg overflow-hidden shadow-md"
//                 >
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteImage(i)}
//                     className="absolute top-1 right-1 z-20 bg-black/70 p-1 rounded-full hover:bg-black"
//                   >
//                     <Trash2 size={14} className="text-red-400" />
//                   </button>

//                   <Image
//                     src={src}
//                     alt="Preview"
//                     fill
//                     className="object-cover"
//                     unoptimized
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>


//         {/* ========================= */}
//         {/* ⭐ SUBMIT */}
//         {/* ========================= */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg"
//         >
//           {loading
//             ? isEdit
//               ? "Updating..."
//               : "Adding..."
//             : isEdit
//             ? "Update Property"
//             : "Add Property"}
//         </button>
//       </form>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AddPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEdit = searchParams.get("edit") === "true";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: "",
    address: "",
    city: "", // ⭐ NEW
    latitude: "",
    longitude: "",
    amenities: [],
    maxGuests: "",
    images: [],
    keywords: [],
    propertyType: "",
    isFeatured: false,
    bedrooms: 1,
    bathrooms: 1,
    size: 0,
    blockedDates: [],
    blockedStart: "",
    blockedEnd: "",
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ⭐ Load Edit Mode Property
  useEffect(() => {
    if (isEdit) {
      const saved = localStorage.getItem("editProperty");
      if (saved) {
        const property = JSON.parse(saved);

        setFormData({
          title: property.title || "",
          description: property.description || "",
          pricePerNight: property.pricePerNight || "",
          address: property.location?.address || "",
          city: property.location?.city || "", // ⭐ NEW
          latitude: property.location?.coordinates?.[1] || "",
          longitude: property.location?.coordinates?.[0] || "",
          amenities: property.amenities || [],
          maxGuests: property.maxGuests || "",
          images: property.images || [],
          keywords: property.keywords || [],
          propertyType: property.propertyType || "",
          isFeatured: property.isFeatured || false,
          bedrooms: property.bedrooms || 1,
          bathrooms: property.bathrooms || 1,
          size: property.size || 0,
          blockedDates: (property.blockedDates || []).map((d) => ({
            start: d.start?.slice(0, 10),
            end: d.end?.slice(0, 10),
          })),
          blockedStart: "",
          blockedEnd: "",
        });

        setPreviewImages(property.images || []);
      }
    }
  }, [isEdit]);

  // ⭐ Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ⭐ Keywords
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setFormData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, newKeyword.trim()],
    }));
    setNewKeyword("");
  };
  const handleRemoveKeyword = (i) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, idx) => idx !== i),
    }));
  };

  // ⭐ Image Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploaded = [];

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (res.ok) {
          const data = await res.json();
          uploaded.push(data.url);
        } else {
          console.error("Upload failed for file:", file.name);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
      setPreviewImages((prev) => [...prev, ...uploaded]);

    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ⭐ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hostId = localStorage.getItem("userId");
    if (!hostId) {
      alert("Please log in first.");
      setLoading(false);
      return;
    }

    const propertyData = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      maxGuests: Number(formData.maxGuests),
      size: Number(formData.size),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      location: {
        type: "Point",
        coordinates: [
          parseFloat(formData.longitude),
          parseFloat(formData.latitude),
        ],
        address: formData.address,
        city: formData.city, // ⭐ NEW
      },
      hostId,
    };

    let res;
    if (isEdit) {
      const old = JSON.parse(localStorage.getItem("editProperty"));
      res = await fetch(`/api/properties/${old._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });
    } else {
      res = await fetch("/api/properties/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });
    }

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert(isEdit ? "Updated Successfully!" : "Property Added!");
      localStorage.removeItem("editProperty");
      router.push("/host/properties");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-3xl mx-auto my-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        {isEdit ? "✏️ Edit Property" : "🏡 Add New Property"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ⭐ TITLE */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* ⭐ DESCRIPTION */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* ⭐ PROPERTY TYPE */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Property Type
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Apartment",
              "House",
              "Private Room",
              "Hotel",
              "Hostel",
              "Guest House",
              "Studio Apartment",
              "Resort",
              "Cottage",
              "Serviced Apartment",
              "Other",
            ].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer dark:text-gray-200"
              >
                <input
                  type="radio"
                  name="propertyType"
                  value={type}
                  checked={formData.propertyType === type}
                  onChange={handleChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* ⭐ FEATURED */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Feature This Property
          </h3>

          <label className="flex items-center gap-3 cursor-pointer dark:text-gray-200">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="h-4 w-4"
            />
            <span className="font-medium">Yes, feature this property</span>
          </label>
        </div>

        {/* ⭐ KEYWORDS */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Keywords
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            {formData.keywords.map((word, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-200"
              >
                {word}
                <button onClick={() => handleRemoveKeyword(i)}>
                  <X size={14} className="text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ⭐ PRICE + GUESTS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Price Per Night
            </label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Max Guests
            </label>
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* ⭐ BEDROOMS / BATHROOMS / SIZE */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Size (sq ft)
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* ⭐ ADDRESS */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* ⭐ CITY (NEW) */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            City
          </label>

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select City</option>
            <option value="Goa">Goa</option>
            <option value="Manali">Manali</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Ooty">Ooty</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Udaipur">Udaipur</option>
          </select>
        </div>

        {/* ⭐ LAT / LNG */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* ⭐ BLOCKED DATES */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Blocked Dates
          </label>

          <div className="grid grid-cols-3 gap-3 items-end">
            <input
              type="date"
              name="blockedStart"
              value={formData.blockedStart}
              onChange={(e) =>
                setFormData({ ...formData, blockedStart: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <input
              type="date"
              name="blockedEnd"
              value={formData.blockedEnd}
              onChange={(e) =>
                setFormData({ ...formData, blockedEnd: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <button
              type="button"
              onClick={() => {
                if (!formData.blockedStart || !formData.blockedEnd) {
                  alert("Select both dates");
                  return;
                }

                setFormData({
                  ...formData,
                  blockedDates: [
                    ...formData.blockedDates,
                    {
                      start: formData.blockedStart,
                      end: formData.blockedEnd,
                    },
                  ],
                  blockedStart: "",
                  blockedEnd: "",
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>

          {/* ⭐ List */}
          <div className="mt-3 space-y-2">
            {formData.blockedDates.map((range, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded"
              >
                <span>
                  {range.start} → {range.end}
                </span>
                <button
                  onClick={() => {
                    const arr = [...formData.blockedDates];
                    arr.splice(i, 1);
                    setFormData({ ...formData, blockedDates: arr });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ AMENITIES */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Amenities
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["WiFi", "Parking", "Pool", "Kitchen", "AC", "TV"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 block mb-2 text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.amenities.includes(item)}
                  onChange={handleChange}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* ⭐ IMAGE UPLOAD */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Upload Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 
            file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 file:rounded-lg"
          />

          {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

          {previewImages.length > 0 && (
            <div className="mt-3 flex gap-3 flex-wrap">
              {previewImages.map((src, i) => (
                <div
                  key={i}
                  className="relative w-28 h-20 rounded-lg overflow-hidden shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className="absolute top-1 right-1 z-20 bg-black/70 p-1 rounded-full hover:bg-black"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>

                  <Image
                    src={src}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ⭐ SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
              ? "Update Property"
              : "Add Property"}
        </button>
      </form>
    </div>
  );
}
