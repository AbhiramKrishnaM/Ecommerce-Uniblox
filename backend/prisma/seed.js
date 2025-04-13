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
    // Electronics
    prisma.product.create({
      data: {
        name: "Wireless Earbuds Pro",
        price: 129.99,
        description: "High-quality wireless earbuds with noise cancellation",
        stock: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Watch X1",
        price: 199.99,
        description: "Feature-rich smartwatch with health tracking",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d",
      },
    }),
    prisma.product.create({
      data: {
        name: "4K Webcam",
        price: 89.99,
        description: "Ultra HD webcam for professional video calls",
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1591815302525-756a9bcc3425",
      },
    }),
    prisma.product.create({
      data: {
        name: "Bluetooth Speaker",
        price: 79.99,
        description: "Portable speaker with 20-hour battery life",
        stock: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      },
    }),
    prisma.product.create({
      data: {
        name: "Gaming Mouse",
        price: 59.99,
        description: "RGB gaming mouse with programmable buttons",
        stock: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1527814050087-3793815479db",
      },
    }),

    // Home & Kitchen
    prisma.product.create({
      data: {
        name: "Smart Coffee Maker",
        price: 149.99,
        description: "WiFi-enabled coffee maker with scheduling",
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1520970014086-2208d157c9e2",
      },
    }),
    prisma.product.create({
      data: {
        name: "Air Fryer XL",
        price: 119.99,
        description: "Large capacity digital air fryer",
        stock: 35,
        imageUrl:
          "https://images.unsplash.com/photo-1648145325911-2d2c3af14e5b",
      },
    }),
    prisma.product.create({
      data: {
        name: "Robot Vacuum",
        price: 299.99,
        description: "Smart robot vacuum with mapping technology",
        stock: 20,
        imageUrl:
          "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec",
      },
    }),

    // Fashion
    prisma.product.create({
      data: {
        name: "Classic Leather Wallet",
        price: 49.99,
        description: "Genuine leather wallet with RFID protection",
        stock: 100,
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93",
      },
    }),
    prisma.product.create({
      data: {
        name: "Sunglasses Pro",
        price: 89.99,
        description: "UV protection sunglasses with polarized lenses",
        stock: 75,
        imageUrl:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      },
    }),

    // Sports & Outdoors
    prisma.product.create({
      data: {
        name: "Yoga Mat Premium",
        price: 39.99,
        description: "Non-slip yoga mat with carrying strap",
        stock: 80,
        imageUrl:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
      },
    }),
    prisma.product.create({
      data: {
        name: "Water Bottle 32oz",
        price: 24.99,
        description: "Insulated stainless steel water bottle",
        stock: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      },
    }),

    // Books & Stationery
    prisma.product.create({
      data: {
        name: "Smart Notebook",
        price: 29.99,
        description: "Reusable smart notebook with app integration",
        stock: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
      },
    }),
    prisma.product.create({
      data: {
        name: "Fountain Pen Set",
        price: 79.99,
        description: "Luxury fountain pen with ink cartridges",
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1585336261022-680e295ce3fe",
      },
    }),

    // Gaming
    prisma.product.create({
      data: {
        name: "Gaming Headset",
        price: 129.99,
        description: "7.1 surround sound gaming headset",
        stock: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      },
    }),
    prisma.product.create({
      data: {
        name: "Mechanical Keyboard",
        price: 149.99,
        description: "RGB mechanical gaming keyboard",
        stock: 35,
        imageUrl:
          "https://images.unsplash.com/photo-1595225476474-87563907198a",
      },
    }),

    // Smart Home
    prisma.product.create({
      data: {
        name: "Smart Light Bulb",
        price: 19.99,
        description: "WiFi-enabled color changing bulb",
        stock: 150,
        imageUrl: "https://images.unsplash.com/photo-1550985543-49d855dd0ce7",
      },
    }),
    prisma.product.create({
      data: {
        name: "Security Camera",
        price: 79.99,
        description: "1080p wireless security camera",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb",
      },
    }),

    // Health & Beauty
    prisma.product.create({
      data: {
        name: "Electric Toothbrush",
        price: 89.99,
        description: "Smart electric toothbrush with timer",
        stock: 55,
        imageUrl: "https://images.unsplash.com/photo-1559591937-abc3a5d2d5c7",
      },
    }),
    prisma.product.create({
      data: {
        name: "Face Massager",
        price: 49.99,
        description: "Electric facial massage tool",
        stock: 65,
        imageUrl:
          "https://images.unsplash.com/photo-1626723184875-e2f096e3edb7",
      },
    }),

    // Office
    prisma.product.create({
      data: {
        name: "Ergonomic Chair",
        price: 299.99,
        description: "Adjustable office chair with lumbar support",
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1592781883486-d3b9a447fa11",
      },
    }),
    prisma.product.create({
      data: {
        name: "Desk Lamp",
        price: 39.99,
        description: "LED desk lamp with wireless charging",
        stock: 70,
        imageUrl:
          "https://images.unsplash.com/photo-1534281368625-1e0d68cce0af",
      },
    }),

    // Accessories
    prisma.product.create({
      data: {
        name: "Phone Stand",
        price: 19.99,
        description: "Adjustable aluminum phone stand",
        stock: 100,
        imageUrl:
          "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
    }),
    prisma.product.create({
      data: {
        name: "Laptop Sleeve",
        price: 29.99,
        description: "Water-resistant laptop sleeve 15-inch",
        stock: 85,
        imageUrl:
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
      },
    }),

    // Tech Accessories
    prisma.product.create({
      data: {
        name: "USB-C Hub",
        price: 45.99,
        description: "7-in-1 USB-C hub adapter",
        stock: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1619953942547-233eab5a70d6",
      },
    }),
    prisma.product.create({
      data: {
        name: "Wireless Charger",
        price: 34.99,
        description: "15W fast wireless charging pad",
        stock: 90,
        imageUrl:
          "https://images.unsplash.com/photo-1622445275463-afa2ab738c34",
      },
    }),

    // Travel
    prisma.product.create({
      data: {
        name: "Travel Adapter",
        price: 25.99,
        description: "Universal travel adapter with USB ports",
        stock: 70,
        imageUrl:
          "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736",
      },
    }),
    prisma.product.create({
      data: {
        name: "Neck Pillow",
        price: 29.99,
        description: "Memory foam travel neck pillow",
        stock: 80,
        imageUrl:
          "https://images.unsplash.com/photo-1520443240718-fce21901db79",
      },
    }),

    // Fitness
    prisma.product.create({
      data: {
        name: "Smart Scale",
        price: 59.99,
        description: "Bluetooth body composition scale",
        stock: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1576678927484-cc907957088c",
      },
    }),
    prisma.product.create({
      data: {
        name: "Resistance Bands",
        price: 19.99,
        description: "Set of 5 exercise resistance bands",
        stock: 100,
        imageUrl:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc",
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
