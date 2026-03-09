import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { calculateMinimumSellPrice } from "../src/services/pricing.service"; 
import dotenv from "dotenv";

dotenv.config();
const RESELLER_TOKEN = process.env.RESELLER_TOKEN!;

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

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
      description: "Standard Plan Gift Card",
      imageUrl: "https://example.com/netflix.jpg",
      costPrice: 40,
      margin: 15,
      value: "NETFLIX-FREE-30-DAYS",
      valueType: "STRING" as const,
    },
    {
      name: "Steam $50 Wallet Code",
      description: "Digital code for Steam",
      imageUrl: "https://example.com/steam.jpg",
      costPrice: 150,
      margin: 10,
      value: "STEAM-VAL-9988-7766",
      valueType: "STRING" as const,
    },
    {
      name: "Starbucks QR Discount",
      description: "Scan this QR for 20% off",
      imageUrl: "https://example.com/starbucks.jpg",
      costPrice: 10,
      margin: 100, 
      value: "https://example.com/qr-code-image.png",
      valueType: "IMAGE" as const,
    },
    {
      name: "PlayStation Store $25",
      description: "PSN Network Card",
      imageUrl: "https://example.com/psn.jpg",
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

  console.log("Seed finished successfully! Added 4 new products.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });