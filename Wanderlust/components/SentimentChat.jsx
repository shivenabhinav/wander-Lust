"use client";

import { useState } from "react";
import { Sparkles, X, Send, MapPin, ShieldCheck, ShieldAlert, Heart } from "lucide-react";

export default function SentimentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    // Knowledge Base mirrored from prompt.txt for Instant Analysis
    const KNOWLEDGE_BASE = {
        NEGATIVE_NORTH: [
            { names: ["Delhi", "New Delhi"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Hyderabad" },
            { names: ["Agra"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Hampi" },
            { names: ["Varanasi"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Madurai" },
            { names: ["Rishikesh"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Hassan" },
            { names: ["Haridwar"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Tiruvannamalai" },
            { names: ["Manali"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Spiti Valley" },
            { names: ["Shimla"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Coorg" },
            { names: ["Srinagar"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Munnar" },
            { names: ["Leh", "Ladakh"], reason: "Seasonal air quality concerns and regional security or situational uncertainties may affect travel suitability", alt: "Dharmasala" },
        ],
        NEGATIVE_COASTAL: [
            { names: ["Goa"], reason: "High visitor density during peak seasons affects cost efficiency and experience", alt: "Gokarna" },
            { names: ["Varkala"], reason: "High visitor density during peak seasons affects cost efficiency and experience", alt: "Wayanad" },
            { names: ["Puducherry", "Pondicherry"], reason: "High visitor density during peak seasons affects cost efficiency and experience", alt: "Chidambaram" },
            { names: ["Port Blair", "Andaman"], reason: "High visitor density during peak seasons affects cost efficiency and experience", alt: "Agumbe" },
        ],
        POSITIVE: [
            "Mysuru", "Mysore", "Hampi", "Tirupati", "Madurai", "Coorg", "Kodagu", "Munnar", "Ooty", "Udhagamandalam",
            "Kodaikanal", "Wayanad", "Chikmagalur", "Belur", "Hassan",
            "Jaipur", "Jaisalmer", "Udaipur", "Jodhpur",
            "Amritsar", "Wagh Border", "Wagah Border", "Jallianwala Bagh",
            "Kolkata", "Calcutta"
        ]
    };

    const checkLocalKnowledge = (text) => {
        const lowerText = text.toLowerCase();
        const foundResults = [];

        const isDuplicate = (destName) => foundResults.some(r => r.destination === destName);

        // Check Negative North
        for (const item of KNOWLEDGE_BASE.NEGATIVE_NORTH) {
            if (item.names.some(n => lowerText.includes(n.toLowerCase()))) {
                if (!isDuplicate(item.names[0])) {
                    foundResults.push({
                        destination: item.names[0],
                        is_safe: false,
                        sentiment: "NEGATIVE",
                        reason: item.reason,
                        alternate_destination: item.alt,
                        warm_gesture: "We hope these insights help you plan a comfortable and memorable trip. Wishing you a pleasant journey and a wonderful travel experience ahead."
                    });
                }
            }
        }

        // Check Negative Coastal
        for (const item of KNOWLEDGE_BASE.NEGATIVE_COASTAL) {
            if (item.names.some(n => lowerText.includes(n.toLowerCase()))) {
                if (!isDuplicate(item.names[0])) {
                    foundResults.push({
                        destination: item.names[0],
                        is_safe: false,
                        sentiment: "NEGATIVE",
                        reason: item.reason,
                        alternate_destination: item.alt,
                        warm_gesture: "We hope these insights help you plan a comfortable and memorable trip. Wishing you a pleasant journey and a wonderful travel experience ahead."
                    });
                }
            }
        }

        // Check Positive
        for (const place of KNOWLEDGE_BASE.POSITIVE) {
            if (lowerText.includes(place.toLowerCase())) {
                if (!isDuplicate(place)) {
                    foundResults.push({
                        destination: place,
                        is_safe: true,
                        sentiment: "POSITIVE",
                        reason: null,
                        alternate_destination: null,
                        warm_gesture: "We hope these insights help you plan a comfortable and memorable trip. Wishing you a pleasant journey and a wonderful travel experience ahead."
                    });
                }
            }
        }

        return foundResults.length > 0 ? foundResults : null;
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResults([]);
        setError(null);

        const localResults = checkLocalKnowledge(input);

        if (localResults) {
            setTimeout(() => {
                setResults(localResults);
                setLoading(false);
            }, 600);
            return;
        }

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sentence: input }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            setResults([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-subtle"
                    title="Ask AI Travel Advisor"
                >
                    <Sparkles className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                        AI Travel Safety
                    </span>
                </button>
            )}

            {/* Chat Interface Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className={`bg-white dark:bg-gray-900 w-full ${results.length > 1 ? 'max-w-2xl' : 'max-w-md'} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200 transition-all`}>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 fill-current opacity-90" />
                                <h3 className="font-bold text-lg">AI Travel Advisor</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {results.length === 0 && !loading && !error && (
                                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                                    <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-violet-600" />
                                    </div>
                                    <p className="font-medium text-lg text-gray-800 dark:text-gray-200">Where do you want to go?</p>
                                    <p className="text-sm mt-2">I can analyze safety trends and suggest alternatives.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                                    <p className="text-sm text-gray-500 animate-pulse">Analyzing safety data...</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm border border-red-100 dark:border-red-900/50">
                                    {error}
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="animate-in slide-in-from-bottom-2 duration-500">
                                    {/* Grid Layout for Results */}
                                    <div className={`grid grid-cols-1 ${results.length > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-4`}>
                                        {results.map((result, idx) => (
                                            <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 shadow-sm flex flex-col h-full">
                                                {/* Status Header */}
                                                <div className={`flex items-start gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 ${result.is_safe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                    {result.is_safe ? <ShieldCheck className="w-6 h-6 flex-shrink-0" /> : <ShieldAlert className="w-6 h-6 flex-shrink-0" />}
                                                    <div>
                                                        <div className="font-bold uppercase tracking-wide text-sm">
                                                            {result.is_safe ? "Safe" : "Caution"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            {result.destination}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reason/Alt Body */}
                                                <div className="flex-1 text-sm space-y-3">
                                                    {!result.is_safe ? (
                                                        <>
                                                            <div className="text-gray-700 dark:text-gray-300">
                                                                <span className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-500 block mb-1">Reason</span>
                                                                {result.reason}
                                                            </div>
                                                            {result.alternate_destination && (
                                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 mt-auto">
                                                                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Try Instead</span>
                                                                    <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-semibold">
                                                                        <MapPin className="w-4 h-4" />
                                                                        {result.alternate_destination}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-4">
                                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
                                                                <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
                                                            </div>
                                                            <p>Excellent choice! Enjoy your stay.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Consolidated Warm Gesture at Bottom */}
                                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex gap-3 shadow-sm">
                                        <Heart className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-indigo-900 dark:text-indigo-200 italic leading-relaxed">
                                            "{results[0].warm_gesture}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleAnalyze} className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="E.g., I want to visit Goa and Mysuru..."
                                    className="w-full pl-4 pr-12 py-3.5 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all shadow-sm outline-none"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
