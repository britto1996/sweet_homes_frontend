export type PropertyCountry = "UAE" | "US";
export type PropertyStatus = "available" | "future";

export type PropertyFacility =
  | "metro"
  | "parking"
  | "gym"
  | "pool"
  | "security"
  | "petFriendly"
  | "seaView"
  | "smartHome"
  | "park"
  | "school";

export type PropertyReview = {
  id: string;
  name: string;
  rating: number; // 1..5
  text: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Property = {
  id: string;
  name: { en: string; ar: string };
  location: { en: string; ar: string };
  country: PropertyCountry;
  city: { en: string; ar: string };
  status: PropertyStatus;
  coords: LatLng;
  usdPricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rating: number;
  reviewCount: number;
  facilities: PropertyFacility[];
  description: { en: string; ar: string };
  images: string[];
  reviews: PropertyReview[];
  contactPhone: string;
};

const sharedImages = [
  "/apartments/dubai-marine-skyline.jpg",
  "/apartments/apartment-2.svg",
  "/apartments/apartment-3.svg",
  "/apartments/apartment-4.svg",
  "/apartments/apartment-5.svg",
  "/apartments/apartment-6.svg",
];

const propertyImages = [
  "/apartments/dubai-marine-skyline.jpg",
  "/apartments/downtown-dubai.jpeg",
  "/apartments/palm-jumeriah.jpg",
]

export const PROPERTIES: Property[] = [
  {
    id: "dubai-marina-skyline",
    name: { en: "Dubai Marina Skyline Apartment", ar: "شقة دبي مارينا - إطلالة أفقية" },
    location: { en: "Dubai Marina", ar: "دبي مارينا" },
    country: "UAE",
    city: { en: "Dubai", ar: "دبي" },
    status: "available",
    coords: { lat: 25.0804, lng: 55.1403 },
    usdPricePerMonth: 2650,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1180,
    rating: 4.8,
    reviewCount: 132,
    facilities: ["seaView", "parking", "gym", "pool", "security", "metro"],
    description: {
      en: "High-floor Marina apartment with sea views, modern finishes, and quick access to the promenade.",
      ar: "شقة في طابق مرتفع بإطلالة بحرية وتشطيبات عصرية مع وصول سريع للممشى.",
    },
    images: propertyImages[0] ? [propertyImages[0]] : [],
    reviews: [
      {
        id: "r1",
        name: "Hassan",
        rating: 5,
        text: "Great view and very clean building. Smooth move-in experience.",
      },
      {
        id: "r2",
        name: "Sara",
        rating: 4,
        text: "Loved the location. A bit busy on weekends, but overall excellent.",
      },
    ],
    contactPhone: "+971500000001",
  },
  {
    id: "downtown-burj-view",
    name: { en: "Downtown Burj View Residence", ar: "سكن وسط المدينة - إطلالة برج" },
    location: { en: "Downtown Dubai", ar: "وسط مدينة دبي" },
    country: "UAE",
    city: { en: "Dubai", ar: "دبي" },
    status: "available",
    coords: { lat: 25.1972, lng: 55.2744 },
    usdPricePerMonth: 3150,
    bedrooms: 1,
    bathrooms: 2,
    sqft: 980,
    rating: 4.7,
    reviewCount: 98,
    facilities: ["parking", "gym", "security", "smartHome", "metro"],
    description: {
      en: "Walkable luxury near Dubai Mall with iconic skyline views and hotel-style amenities.",
      ar: "فخامة قريبة من دبي مول مع إطلالات أيقونية ومرافق على طراز الفنادق.",
    },
    images: propertyImages[1] ? [propertyImages[1]] : [],
    reviews: [
      {
        id: "r3",
        name: "Amina",
        rating: 5,
        text: "Perfect for city life. Everything is nearby and the lobby feels premium.",
      },
    ],
    contactPhone: "+971500000002",
  },
  {
    id: "palm-jumeirah-villa",
    name: { en: "Palm Jumeirah Signature Villa", ar: "فيلا نخلة جميرا المميزة" },
    location: { en: "Palm Jumeirah", ar: "نخلة جميرا" },
    country: "UAE",
    city: { en: "Dubai", ar: "دبي" },
    status: "available",
    coords: { lat: 25.1124, lng: 55.1390 },
    usdPricePerMonth: 12500,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 5400,
    rating: 4.9,
    reviewCount: 54,
    facilities: ["seaView", "pool", "parking", "security", "petFriendly"],
    description: {
      en: "Signature villa with private beach access, spacious living areas, and premium privacy.",
      ar: "فيلا بإمكانية وصول خاص للشاطئ ومساحات واسعة وخصوصية عالية.",
    },
    images: propertyImages[2] ? [propertyImages[2]] : [],
    reviews: [
      {
        id: "r4",
        name: "Omar",
        rating: 5,
        text: "Unmatched privacy and stunning sunsets. Highly recommended.",
      },
    ],
    contactPhone: "+971500000003",
  },

  // Future (UAE)
  {
    id: "dubai-creek-harbour-future",
    name: { en: "Dubai Creek Harbour (Future Towers)", ar: "خور دبي (أبراج مستقبلية)" },
    location: { en: "Dubai Creek Harbour", ar: "خور دبي" },
    country: "UAE",
    city: { en: "Dubai", ar: "دبي" },
    status: "future",
    coords: { lat: 25.2063, lng: 55.3440 },
    usdPricePerMonth: 2200,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    rating: 4.6,
    reviewCount: 0,
    facilities: ["park", "metro", "security", "gym"],
    description: {
      en: "Upcoming towers with waterfront promenade access and future retail/community hubs.",
      ar: "أبراج قادمة مع ممشى مائي وخدمات مجتمعية وتجارية مستقبلية.",
    },
    images: propertyImages[3] ? [propertyImages[3]] : [],
    reviews: [],
    contactPhone: "+971500000010",
  },
  {
    id: "expo-city-future",
    name: { en: "Expo City Residences (Future)", ar: "مساكن إكسبو سيتي (قريباً)" },
    location: { en: "Expo City Dubai", ar: "إكسبو سيتي دبي" },
    country: "UAE",
    city: { en: "Dubai", ar: "دبي" },
    status: "future",
    coords: { lat: 24.9593, lng: 55.1498 },
    usdPricePerMonth: 1800,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 720,
    rating: 4.5,
    reviewCount: 0,
    facilities: ["smartHome", "park", "school", "security"],
    description: {
      en: "Sustainable district living with smart infrastructure and community-first planning.",
      ar: "منطقة مستدامة ببنية ذكية وتخطيط يركز على المجتمع.",
    },
    images: sharedImages,
    reviews: [],
    contactPhone: "+971500000011",
  },

  // US
  {
    id: "miami-bayside-condo",
    name: { en: "Miami Bayside Condo", ar: "شقة ميامي - باي سايد" },
    location: { en: "Bayside", ar: "باي سايد" },
    country: "US",
    city: { en: "Miami", ar: "ميامي" },
    status: "available",
    coords: { lat: 25.7781, lng: -80.1867 },
    usdPricePerMonth: 2450,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 760,
    rating: 4.6,
    reviewCount: 41,
    facilities: ["pool", "gym", "parking", "petFriendly"],
    description: {
      en: "Bright condo close to the bay and downtown hotspots. Great for work + lifestyle.",
      ar: "شقة مضيئة قرب الخليج ووسط المدينة. مثالية للعمل ونمط الحياة.",
    },
    images: sharedImages,
    reviews: [
      {
        id: "r5",
        name: "James",
        rating: 5,
        text: "Loved the pool deck and the building staff. Great value.",
      },
    ],
    contactPhone: "+13050000001",
  },
  {
    id: "austin-tech-loft-future",
    name: { en: "Austin Tech Loft (Future)", ar: "لوفت أوستن التقني (قريباً)" },
    location: { en: "East Austin", ar: "شرق أوستن" },
    country: "US",
    city: { en: "Austin", ar: "أوستن" },
    status: "future",
    coords: { lat: 30.2677, lng: -97.7239 },
    usdPricePerMonth: 1900,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 820,
    rating: 4.4,
    reviewCount: 0,
    facilities: ["smartHome", "gym", "park"],
    description: {
      en: "Future-forward lofts in a walkable tech neighborhood with modern shared spaces.",
      ar: "لوفتات حديثة في حي تقني قابل للمشي مع مساحات مشتركة عصرية.",
    },
    images: sharedImages,
    reviews: [],
    contactPhone: "+15120000001",
  },
];

export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}
