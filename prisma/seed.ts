import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 12);

  // ─── Users ────────────────────────────────────────────────────────────────────
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        id: "u1", name: "Sipho Dlamini", email: "sipho@farm.co.za",
        phone: "+27821234567", passwordHash, role: "farmer",
        country: "ZA", province: "KwaZulu-Natal", city: "Pietermaritzburg",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sipho",
        bio: "Third-generation farmer specialising in organic vegetables and maize.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-08-12T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u2", name: "Grace Moyo", email: "grace@zimfarm.co.zw",
        phone: "+263771234567", passwordHash, role: "farmer",
        country: "ZW", province: "Mashonaland East", city: "Marondera",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Grace",
        bio: "Smallholder farmer growing tomatoes, onions, and leafy greens near Marondera.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-09-03T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u3", name: "Thabiso Nkosi", email: "thabiso@limpopofarm.co.za",
        phone: "+27761234567", passwordHash, role: "farmer",
        country: "ZA", province: "Limpopo", city: "Tzaneen",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Thabiso",
        bio: "Citrus and avocado farmer with over 80 hectares in Tzaneen.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-07-20T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u4", name: "Nomsa Khumalo", email: "nomsa@farm.co.za",
        phone: "+27831234567", passwordHash, role: "farmer",
        country: "ZA", province: "Mpumalanga", city: "Nelspruit",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nomsa",
        bio: "Livestock and poultry farmer supplying fresh produce to local markets.",
        isVerified: false, isSuspended: false,
        createdAt: new Date("2026-01-15T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u5", name: "Chiedza Murambwa", email: "chiedza@harare.co.zw",
        phone: "+263712345678", passwordHash, role: "farmer",
        country: "ZW", province: "Harare Province", city: "Harare",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Chiedza",
        bio: "Urban farming specialist — leafy greens, herbs, and butternut squash.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-10-05T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u6", name: "Amahle Zulu", email: "amahle@restaurant.co.za",
        phone: "+27851234567", passwordHash, role: "buyer",
        country: "ZA", province: "Gauteng", city: "Johannesburg",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Amahle",
        bio: "Head chef and sourcing manager for Roots Kitchen Restaurant group.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-09-18T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u7", name: "Tendai Chikwanda", email: "tendai@freshmart.co.zw",
        phone: "+263781234567", passwordHash, role: "buyer",
        country: "ZW", province: "Bulawayo Province", city: "Bulawayo",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Tendai",
        bio: "Procurement officer for FreshMart grocery chain, Bulawayo.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-10-22T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u8", name: "Lindiwe Mahlangu", email: "lindiwe@streetfood.co.za",
        phone: "+27791234567", passwordHash, role: "buyer",
        country: "ZA", province: "Gauteng", city: "Soweto",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lindiwe",
        bio: "Street food vendor buying bulk produce for daily cooking.",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-11-10T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u9", name: "Bongani Sithole", email: "bongani@grocer.co.za",
        phone: "+27881234567", passwordHash, role: "buyer",
        country: "ZA", province: "KwaZulu-Natal", city: "Durban",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bongani",
        bio: "Owner of Sithole Fresh Produce market stall in Warwick Junction.",
        isVerified: false, isSuspended: false,
        createdAt: new Date("2026-02-01T08:00:00Z"),
      },
    }),
    prisma.user.create({
      data: {
        id: "u10", name: "Admin User", email: "admin@zerowaste.farm",
        phone: "+27001234567", passwordHash, role: "admin",
        country: "ZA", province: "Gauteng", city: "Johannesburg",
        profilePhoto: "https://api.dicebear.com/9.x/avataaars/svg?seed=Admin",
        isVerified: true, isSuspended: false,
        createdAt: new Date("2025-06-01T08:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ─── Listings ─────────────────────────────────────────────────────────────────
  const listings = await prisma.$transaction([
    prisma.listing.create({
      data: {
        id: "l1", farmerId: "u1", title: "Fresh Mielies (Maize) — 200kg Surplus",
        category: "grains",
        description: "Yellow maize freshly harvested. Good eating quality. Surplus from this season's crop — must sell before end of week. Ideal for grain mills, animal feed, or bulk home cooking.",
        quantity: 200, unit: "kg", price: 3.5, currency: "ZAR", urgency: "high",
        country: "ZA", province: "KwaZulu-Natal", city: "Pietermaritzburg",
        photos: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "https://images.unsplash.com/photo-1604891803982-4e0c96f8d9b5?w=800"],
        status: "active", views: 142, isFeatured: true,
        expiresAt: new Date("2026-03-10T23:59:59Z"), createdAt: new Date("2026-03-05T08:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l2", farmerId: "u2", title: "Ripe Tomatoes — 5 Crates",
        category: "vegetables",
        description: "Fresh, ripe Roma tomatoes. Harvested today. 5 crates available. Perfect for restaurants, sauce production, or street food vendors. Must go — cannot store for more than 2 days.",
        quantity: 5, unit: "crate", price: 12, currency: "USD", urgency: "critical",
        country: "ZW", province: "Mashonaland East", city: "Marondera",
        photos: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800", "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800"],
        status: "active", views: 89, isFeatured: true,
        expiresAt: new Date("2026-03-08T23:59:59Z"), createdAt: new Date("2026-03-06T06:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l3", farmerId: "u3", title: "Avocados — 3 Tons Surplus",
        category: "fruits",
        description: "Hass avocados at peak ripeness. 3 tonnes available after market allocation. Grade 2 fruit — still excellent for restaurants and home use. Price is per kg.",
        quantity: 3000, unit: "kg", price: 8, currency: "ZAR", urgency: "medium",
        country: "ZA", province: "Limpopo", city: "Tzaneen",
        photos: ["https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800"],
        status: "active", views: 211, isFeatured: true,
        expiresAt: new Date("2026-03-14T23:59:59Z"), createdAt: new Date("2026-03-04T09:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l4", farmerId: "u4", title: "Free-range Chickens — 50 Head",
        category: "poultry",
        description: "Live free-range broiler chickens, 1.8–2.2kg each. Ready for slaughter. Selling surplus stock. Collection from farm in Nelspruit only.",
        quantity: 50, unit: "head", price: 85, currency: "ZAR", urgency: "high",
        country: "ZA", province: "Mpumalanga", city: "Nelspruit",
        photos: ["https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800"],
        status: "active", views: 67, isFeatured: false,
        expiresAt: new Date("2026-03-11T23:59:59Z"), createdAt: new Date("2026-03-06T10:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l5", farmerId: "u5", title: "Butternut Squash — 300kg",
        category: "vegetables",
        description: "Beautiful butternut squash from peri-urban Harare garden. Uniform size, excellent shelf life. Selling 300kg surplus. Delivery possible within Harare.",
        quantity: 300, unit: "kg", price: 0.8, currency: "USD", urgency: "low",
        country: "ZW", province: "Harare Province", city: "Harare",
        photos: ["https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800"],
        status: "active", views: 44, isFeatured: false,
        expiresAt: new Date("2026-03-21T23:59:59Z"), createdAt: new Date("2026-03-03T08:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l6", farmerId: "u1", title: "Baby Spinach — 80kg",
        category: "vegetables",
        description: "Tender baby spinach, washed and packed in 500g bags. 80kg available. Perfect for restaurants and health food outlets. Harvested this morning.",
        quantity: 80, unit: "kg", price: 22, currency: "ZAR", urgency: "critical",
        country: "ZA", province: "KwaZulu-Natal", city: "Pietermaritzburg",
        photos: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800"],
        status: "active", views: 93, isFeatured: false,
        expiresAt: new Date("2026-03-08T23:59:59Z"), createdAt: new Date("2026-03-07T05:30:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l7", farmerId: "u3", title: "Navel Oranges — 500kg",
        category: "fruits",
        description: "Sweet, juicy navel oranges from our Tzaneen grove. 500kg surplus after export grading. Selling at farm price. Ideal for juice bars, markets, and retailers.",
        quantity: 500, unit: "kg", price: 4, currency: "ZAR", urgency: "medium",
        country: "ZA", province: "Limpopo", city: "Tzaneen",
        photos: ["https://images.unsplash.com/photo-1547514701-42782101795e?w=800"],
        status: "active", views: 158, isFeatured: true,
        expiresAt: new Date("2026-03-17T23:59:59Z"), createdAt: new Date("2026-03-02T09:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l8", farmerId: "u2", title: "Green Cabbages — 2 Crates",
        category: "vegetables",
        description: "Large, firm green cabbages. 2 crates (approx 40 heads). Freshly cut. Available for pickup in Marondera town. Good price for quick sale.",
        quantity: 2, unit: "crate", price: 8, currency: "USD", urgency: "high",
        country: "ZW", province: "Mashonaland East", city: "Marondera",
        photos: ["https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800"],
        status: "active", views: 31, isFeatured: false,
        expiresAt: new Date("2026-03-10T23:59:59Z"), createdAt: new Date("2026-03-06T07:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l9", farmerId: "u4", title: "Goats for Sale — 12 Head",
        category: "livestock",
        description: "Healthy Boer goats, mixed ages. 12 head available. Currently grazing — need to reduce herd size. Price negotiable for bulk purchase. Collection only, Nelspruit farm.",
        quantity: 12, unit: "head", price: 1200, currency: "ZAR", urgency: "low",
        country: "ZA", province: "Mpumalanga", city: "Nelspruit",
        photos: ["https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=800"],
        status: "active", views: 52, isFeatured: false,
        expiresAt: new Date("2026-03-28T23:59:59Z"), createdAt: new Date("2026-02-28T10:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l10", farmerId: "u5", title: "Fresh Herbs Bundle — 20kg Mixed",
        category: "herbs",
        description: "Mixed herb bundle: parsley, coriander, thyme, and basil. 20kg total (5kg each). Freshly cut from garden. Perfect for restaurant and hotel kitchens in Harare.",
        quantity: 20, unit: "kg", price: 3, currency: "USD", urgency: "critical",
        country: "ZW", province: "Harare Province", city: "Harare",
        photos: ["https://images.unsplash.com/photo-1466193249781-aad7c87ba7d4?w=800"],
        status: "active", views: 72, isFeatured: false,
        expiresAt: new Date("2026-03-08T23:59:59Z"), createdAt: new Date("2026-03-06T08:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l11", farmerId: "u1", title: "Sweet Potatoes — 150kg",
        category: "vegetables",
        description: "Orange-fleshed sweet potatoes, 150kg available. Farm-fresh, excellent condition. Sell within 2 weeks. Bulk discount available for 100kg+.",
        quantity: 150, unit: "kg", price: 6, currency: "ZAR", urgency: "medium",
        country: "ZA", province: "KwaZulu-Natal", city: "Pietermaritzburg",
        photos: ["https://images.unsplash.com/photo-1596097557993-54e1b2d3d626?w=800"],
        status: "active", views: 61, isFeatured: false,
        expiresAt: new Date("2026-03-19T23:59:59Z"), createdAt: new Date("2026-03-04T08:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l12", farmerId: "u2", title: "Onions — 4 Bags (50kg each)",
        category: "vegetables",
        description: "Red and white onions, mixed. 4 x 50kg bags. Well-cured, good shelf life. Surplus from market allocation. Selling at bulk discount. Pickup or delivery Marondera area.",
        quantity: 4, unit: "bag", price: 25, currency: "USD", urgency: "low",
        country: "ZW", province: "Mashonaland East", city: "Marondera",
        photos: ["https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800"],
        status: "active", views: 47, isFeatured: false,
        expiresAt: new Date("2026-03-28T23:59:59Z"), createdAt: new Date("2026-03-01T09:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l13", farmerId: "u3", title: "Mangoes — 800kg Alphonso",
        category: "fruits",
        description: "Premium Alphonso mangoes, 800kg surplus from this week's harvest. Sweetest variety available. Price per kg. Suitable for export, juice production, or retail.",
        quantity: 800, unit: "kg", price: 12, currency: "ZAR", urgency: "high",
        country: "ZA", province: "Limpopo", city: "Tzaneen",
        photos: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=800"],
        status: "active", views: 134, isFeatured: true,
        expiresAt: new Date("2026-03-13T23:59:59Z"), createdAt: new Date("2026-03-05T07:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l14", farmerId: "u5", title: "Maize Meal — 20 x 10kg Bags",
        category: "grains",
        description: "Stone-ground maize meal. 20 bags of 10kg each. Milled fresh from our own harvest. Great texture and taste. Ideal for caterers and informal traders.",
        quantity: 20, unit: "bag", price: 5.5, currency: "USD", urgency: "medium",
        country: "ZW", province: "Harare Province", city: "Harare",
        photos: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"],
        status: "active", views: 29, isFeatured: false,
        expiresAt: new Date("2026-03-22T23:59:59Z"), createdAt: new Date("2026-03-03T10:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l15", farmerId: "u4", title: "Fresh Farm Eggs — 30 Dozen",
        category: "poultry",
        description: "Free-range chicken eggs. 30 dozen available. Collected daily — absolutely fresh. Grade A, clean, unfertilized. Ideal for bakeries, restaurants, and households.",
        quantity: 30, unit: "dozen", price: 38, currency: "ZAR", urgency: "high",
        country: "ZA", province: "Mpumalanga", city: "Nelspruit",
        photos: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800"],
        status: "active", views: 88, isFeatured: false,
        expiresAt: new Date("2026-03-11T23:59:59Z"), createdAt: new Date("2026-03-06T09:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l16", farmerId: "u1", title: "Raw Milk — 100 Litres",
        category: "dairy",
        description: "Fresh raw cow's milk. 100 litres available daily from our Pietermaritzburg dairy herd. Pasteurisation on request. Must be collected each day — cannot store.",
        quantity: 100, unit: "litre", price: 9, currency: "ZAR", urgency: "critical",
        country: "ZA", province: "KwaZulu-Natal", city: "Pietermaritzburg",
        photos: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800"],
        status: "active", views: 76, isFeatured: false,
        expiresAt: new Date("2026-03-09T23:59:59Z"), createdAt: new Date("2026-03-08T04:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l17", farmerId: "u2", title: "Dried Black-eyed Beans — 5 x 25kg",
        category: "grains",
        description: "Sun-dried black-eyed beans. 5 x 25kg bags. High protein, long shelf life. Harvested and dried in March. Ideal for wholesalers and restaurants.",
        quantity: 5, unit: "bag", price: 30, currency: "USD", urgency: "low",
        country: "ZW", province: "Mashonaland East", city: "Marondera",
        photos: ["https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800"],
        status: "pending_review", views: 0, isFeatured: false,
        expiresAt: new Date("2026-04-01T23:59:59Z"), createdAt: new Date("2026-03-08T11:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l18", farmerId: "u3", title: "Bananas — 2 Tons",
        category: "fruits",
        description: "Cavendish bananas, ripe and ready. 2 tonnes available this week. Ideal for market vendors, juice bars, and supermarkets. Must move quickly.",
        quantity: 2000, unit: "kg", price: 5, currency: "ZAR", urgency: "critical",
        country: "ZA", province: "Limpopo", city: "Tzaneen",
        photos: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800"],
        status: "active", views: 119, isFeatured: false,
        expiresAt: new Date("2026-03-10T23:59:59Z"), createdAt: new Date("2026-03-07T08:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l19", farmerId: "u4", title: "Pork — Half Carcass",
        category: "livestock",
        description: "Freshly slaughtered pork. One half carcass (approx 35kg). Farm-raised, no growth hormones. Ideal for butchers or catering businesses. Collect from Nelspruit farm.",
        quantity: 35, unit: "kg", price: 65, currency: "ZAR", urgency: "critical",
        country: "ZA", province: "Mpumalanga", city: "Nelspruit",
        photos: ["https://images.unsplash.com/photo-1558030006-450675393462?w=800"],
        status: "active", views: 41, isFeatured: false,
        expiresAt: new Date("2026-03-09T23:59:59Z"), createdAt: new Date("2026-03-08T07:00:00Z"),
      },
    }),
    prisma.listing.create({
      data: {
        id: "l20", farmerId: "u5", title: "Moringa Powder — 10kg",
        category: "herbs",
        description: "Pure dried moringa leaf powder. 10kg available. Organically grown, no additives. Packed in 500g resealable bags. High demand item — contact early.",
        quantity: 10, unit: "kg", price: 8, currency: "USD", urgency: "medium",
        country: "ZW", province: "Harare Province", city: "Harare",
        photos: ["https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800"],
        status: "active", views: 55, isFeatured: false,
        expiresAt: new Date("2026-03-20T23:59:59Z"), createdAt: new Date("2026-03-05T10:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${listings.length} listings`);

  // ─── Transactions ─────────────────────────────────────────────────────────────
  const transactions = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        id: "t1", listingId: "l1", listingTitle: "Fresh Mielies (Maize) — 200kg Surplus",
        buyerId: "u6", buyerName: "Amahle Zulu", farmerId: "u1", farmerName: "Sipho Dlamini",
        amount: 700, currency: "ZAR", commissionRate: 5, commissionValue: 35,
        status: "completed", createdAt: new Date("2026-02-14T10:00:00Z"),
      },
    }),
    prisma.transaction.create({
      data: {
        id: "t2", listingId: "l7", listingTitle: "Navel Oranges — 500kg",
        buyerId: "u8", buyerName: "Lindiwe Mahlangu", farmerId: "u3", farmerName: "Thabiso Nkosi",
        amount: 2000, currency: "ZAR", commissionRate: 5, commissionValue: 100,
        status: "completed", createdAt: new Date("2026-02-20T11:00:00Z"),
      },
    }),
    prisma.transaction.create({
      data: {
        id: "t3", listingId: "l2", listingTitle: "Ripe Tomatoes — 5 Crates",
        buyerId: "u7", buyerName: "Tendai Chikwanda", farmerId: "u2", farmerName: "Grace Moyo",
        amount: 60, currency: "USD", commissionRate: 5, commissionValue: 3,
        status: "contacted", createdAt: new Date("2026-03-01T09:00:00Z"),
      },
    }),
    prisma.transaction.create({
      data: {
        id: "t4", listingId: "l3", listingTitle: "Avocados — 3 Tons Surplus",
        buyerId: "u9", buyerName: "Bongani Sithole", farmerId: "u3", farmerName: "Thabiso Nkosi",
        amount: 24000, currency: "ZAR", commissionRate: 5, commissionValue: 1200,
        status: "pending", createdAt: new Date("2026-03-05T14:00:00Z"),
      },
    }),
    prisma.transaction.create({
      data: {
        id: "t5", listingId: "l10", listingTitle: "Fresh Herbs Bundle — 20kg Mixed",
        buyerId: "u6", buyerName: "Amahle Zulu", farmerId: "u5", farmerName: "Chiedza Murambwa",
        amount: 60, currency: "USD", commissionRate: 5, commissionValue: 3,
        status: "completed", createdAt: new Date("2026-02-28T08:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${transactions.length} transactions`);

  // ─── Notifications ────────────────────────────────────────────────────────────
  const notifications = await prisma.$transaction([
    prisma.notification.create({
      data: {
        id: "n1", userId: "u1", type: "new_contact",
        title: "New buyer interested",
        message: "Amahle Zulu has contacted you about your Mielies listing.",
        isRead: false, href: "/dashboard/listings",
        createdAt: new Date("2026-03-06T10:00:00Z"),
      },
    }),
    prisma.notification.create({
      data: {
        id: "n2", userId: "u1", type: "listing_expiring",
        title: "Listing expiring soon",
        message: "Your Baby Spinach listing expires in 24 hours.",
        isRead: false, href: "/dashboard/listings",
        createdAt: new Date("2026-03-07T05:00:00Z"),
      },
    }),
    prisma.notification.create({
      data: {
        id: "n3", userId: "u6", type: "new_listing",
        title: "New listing in your area",
        message: "A new listing of Avocados was posted in Limpopo.",
        isRead: false, href: "/marketplace/l3",
        createdAt: new Date("2026-03-04T09:00:00Z"),
      },
    }),
    prisma.notification.create({
      data: {
        id: "n4", userId: "u1", type: "listing_sold",
        title: "Listing marked as sold",
        message: "Your Mielies listing has been marked as sold. Great work!",
        isRead: true, href: "/dashboard/listings",
        createdAt: new Date("2026-02-14T15:00:00Z"),
      },
    }),
    prisma.notification.create({
      data: {
        id: "n5", userId: "u6", type: "account_verified",
        title: "Account verified",
        message: "Your buyer account has been verified by ZeroWaste Farm.",
        isRead: true,
        createdAt: new Date("2025-09-19T09:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

  console.log("\n🎉 Seeding complete!");
  console.log("───────────────────────────────────────");
  console.log("Demo credentials (all passwords: demo1234)");
  console.log("  Farmer : sipho@farm.co.za");
  console.log("  Buyer  : amahle@restaurant.co.za");
  console.log("  Admin  : admin@zerowaste.farm");
  console.log("───────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
