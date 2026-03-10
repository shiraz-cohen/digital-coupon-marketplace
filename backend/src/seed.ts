import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { calculateMinimumSellPrice } from "../src/services/pricing.service"; 
import dotenv from "dotenv";

dotenv.config();
const RESELLER_TOKEN = process.env.RESELLER_TOKEN!;

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // יצירת משתמש אדמין
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  // יצירת משתמש ריסלר
  await prisma.user.upsert({
    where: { email: "reseller@example.com" },
    update: { apiToken: RESELLER_TOKEN },
    create: {
      email: "reseller@example.com",
      role: "RESELLER",
      apiToken: RESELLER_TOKEN,
    },
  });

  const productsToCreate = [
    {
      name: "Netflix 1 Month Subscription",
      description: "Standard Plan Gift Card - Enjoy unlimited movies and TV shows.",
      // תמונת נטפליקס אמיתית
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop",
      costPrice: 40,
      margin: 15,
      value: "NETFLIX-FREE-30-DAYS",
      valueType: "STRING" as const,
    },
    {
      name: "Steam $50 Wallet Code",
      description: "Digital code for Steam - Access thousands of games.",
      // תמונת גיימינג/סטיים אמיתית
      imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1000&auto=format&fit=crop",
      costPrice: 150,
      margin: 10,
      value: "STEAM-VAL-9988-7766",
      valueType: "STRING" as const,
    },
    {
      name: "Starbucks QR Discount",
      description: "Scan this QR for 20% off your next coffee.",
      // תמונת קפה/סטארבקס אמיתית
      imageUrl: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop",
      costPrice: 10,
      margin: 100, 
      // קישור ל-QR אמיתי לדוגמה
      value: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      valueType: "IMAGE" as const,
    },
    {
      name: "PlayStation Store $25",
      description: "PSN Network Card - Buy the latest games and add-ons.",
      // תמונת פלייסטיישן אמיתית
      imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop",
      costPrice: 80,
      margin: 25,
      value: "PSN-CODE-XXXX-YYYY",
      valueType: "STRING" as const,
    }
  ];

  for (const p of productsToCreate) {
    const minPrice = calculateMinimumSellPrice(p.costPrice, p.margin);

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        type: "COUPON",
        imageUrl: p.imageUrl,
        coupon: {
          create: {
            costPrice: p.costPrice,
            marginPercentage: p.margin,
            minimumSellPrice: minPrice,
            valueType: p.valueType,
            value: p.value,
            isSold: false,
          },
        },
      },
    });
  }

  console.log("Seed finished successfully! Added 4 new products with real images.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });