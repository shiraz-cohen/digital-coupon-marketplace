// import { prisma } from "./utils/prisma";
// import { calculateMinimumSellPrice } from "./services/pricing.service";

// async function main() {
//   const product = await prisma.product.create({
//     data: {
//       name: "Amazon $100 Coupon",
//       description: "Gift card",
//       type: "COUPON",
//       imageUrl: "https://example.com/amazon.jpg",
//       coupon: {
//         create: {
//           costPrice: 80,
//           marginPercentage: 25,
//           minimumSellPrice: calculateMinimumSellPrice(80, 25),
//           valueType: "STRING",
//           value: "ABCD-1234",
//         },
//       },
//     },
//   });

//   console.log("Seeded product:", product);
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());



import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  // RESELLER עם token
  await prisma.user.upsert({
    where: { email: "reseller@example.com" },
    update: {},
    create: {
      email: "reseller@example.com",
      role: "RESELLER",
      apiToken: "my-reseller-token-123", // token קבוע
    },
  });
}



main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());