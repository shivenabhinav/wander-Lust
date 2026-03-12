import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    // ⭐ SMART PRICING
    monthlyPricing: {
      type: Map,
      of: Number, // price for that month
      default: {},
    },

    // ⭐ LOCATION
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: { type: String, required: true },
      city: { type: String, required: true }, // ⭐ REQUIRED FOR DESTINATION FILTER
    },

    // ⭐ AMENITIES
    amenities: {
      type: [String],
      default: [],
    },

    // ⭐ CLOUDINARY IMAGES
    images: {
      type: [String], // URLs
      required: true,
    },

    // ⭐ MAX GUESTS
    maxGuests: {
      type: Number,
      required: true,
    },

    // ⭐ BASIC REVIEWS DATA
    ratingsAvg: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    // ⭐ KEYWORDS / TAGS
    keywords: {
      type: [String],
      default: [],
    },

    // ⭐ PROPERTY TYPE (Airbnb style)
    propertyType: {
      type: String,
      enum: [
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
        "Bungalow",
        "Farmhouse",
        "Other",
      ],
      default: "Apartment",
    },

    // ⭐ FEATURED FOR HOMEPAGE
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ⭐ EXTRA DETAILS
    bedrooms: {
      type: Number,
      default: 1,
    },

    bathrooms: {
      type: Number,
      default: 1,
    },

    size: {
      type: Number, // square feet
      default: 0,
    },

    // ⭐ AVAILABILITY CALENDAR (dates blocked by host)
    blockedDates: {
      type: [
        {
          start: { type: Date, required: true },
          end: { type: Date, required: true },
        },
      ],
      default: [],
      required: false,
    },

    // ⭐ HOST EARNINGS TRACKING
    totalEarnings: {
      type: Number,
      default: 0,
    },

    // ⭐ STATUS (important for scaling)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// Enable geospatial search
PropertySchema.index({ location: "2dsphere" });

// Delete old model if exists so schema updates apply
mongoose.models.Property && mongoose.deleteModel("Property");

export default mongoose.model("Property", PropertySchema);
