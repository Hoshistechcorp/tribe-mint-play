export interface Campaign {
  id: string;
  businessId: string;
  businessName: string;
  businessImage: string;
  title: string;
  description: string;
  type: "open" | "featured" | "exclusive";
  commission: number;
  bonusReward?: string;
  deadline: string;
  slots: number;
  slotsUsed: number;
  tags: string[];
  city: string;
}

export const sampleCampaigns: Campaign[] = [
  {
    id: "c1",
    businessId: "1",
    businessName: "The Mint Garden",
    businessImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    title: "Weekend Brunch Push 🥂",
    description: "Promote our new weekend brunch menu and earn on every reservation.",
    type: "open",
    commission: 15,
    deadline: "Mar 31, 2026",
    slots: 50,
    slotsUsed: 23,
    tags: ["brunch", "food", "weekend"],
    city: "Lagos",
  },
  {
    id: "c2",
    businessId: "2",
    businessName: "Azure Hotel & Spa",
    businessImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    title: "Spring Getaway 🌸",
    description: "Drive bookings for our spring spa packages.",
    type: "featured",
    commission: 22,
    bonusReward: "Free spa day for top promoter",
    deadline: "Apr 15, 2026",
    slots: 30,
    slotsUsed: 18,
    tags: ["spa", "luxury", "spring"],
    city: "London",
  },
  {
    id: "c3",
    businessId: "5",
    businessName: "Skyline Suites",
    businessImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    title: "Dubai Summer Deals ☀️",
    description: "Exclusive rates for summer bookings. High commission per booking.",
    type: "exclusive",
    commission: 25,
    bonusReward: "2-night free stay for top 3",
    deadline: "Jun 1, 2026",
    slots: 10,
    slotsUsed: 7,
    tags: ["luxury", "summer", "exclusive"],
    city: "Dubai",
  },
  {
    id: "c4",
    businessId: "3",
    businessName: "Neon Lounge",
    businessImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop",
    title: "Friday Night Fever 🎵",
    description: "Fill the house every Friday. Earn per ticket sold.",
    type: "open",
    commission: 10,
    deadline: "Ongoing",
    slots: 100,
    slotsUsed: 45,
    tags: ["nightlife", "events", "music"],
    city: "Lagos",
  },
  {
    id: "c5",
    businessId: "7",
    businessName: "Coral Bay Resort",
    businessImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    title: "Honeymoon Package 💍",
    description: "Premium honeymoon packages with high-value commissions.",
    type: "featured",
    commission: 20,
    bonusReward: "$200 bonus at 10 bookings",
    deadline: "May 30, 2026",
    slots: 20,
    slotsUsed: 8,
    tags: ["romantic", "beach", "honeymoon"],
    city: "Zanzibar",
  },
  {
    id: "c6",
    businessId: "4",
    businessName: "Bamboo Kitchen",
    businessImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    title: "New Menu Launch 🍛",
    description: "Help us spread the word on our new Pan-African fusion menu.",
    type: "open",
    commission: 12,
    deadline: "Apr 10, 2026",
    slots: 40,
    slotsUsed: 12,
    tags: ["food", "launch", "african"],
    city: "Accra",
  },
  {
    id: "c7",
    businessId: "6",
    businessName: "Velvet Room",
    businessImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    title: "VIP Cocktail Night 🍸",
    description: "Invite-only. Promote our exclusive cocktail tasting event.",
    type: "exclusive",
    commission: 14,
    bonusReward: "Free VIP entry + drinks",
    deadline: "Mar 25, 2026",
    slots: 5,
    slotsUsed: 3,
    tags: ["vip", "cocktails", "exclusive"],
    city: "London",
  },
];
