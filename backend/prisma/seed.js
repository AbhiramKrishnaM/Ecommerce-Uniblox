import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.discountCode.deleteMany({});

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Product 1",
        price: 19.99,
        description: "Description for product 1",
        stock: 100,
      },
    }),
    prisma.product.create({
      data: {
        name: "Product 2",
        price: 29.99,
        description: "Description for product 2",
        stock: 50,
      },
    }),
  ]);

  // Create sample discount code
  const discountCode = await prisma.discountCode.create({
    data: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10.0,
      maxUses: 100,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
