import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env first.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const products = [
  { name: 'Mechanical Keyboard', description: 'Tenkeyless, brown switches', price: 89.9, stock: 25 },
  { name: 'Wireless Mouse', description: 'Ergonomic, 2.4 GHz', price: 29.5, stock: 60 },
  { name: 'USB-C Hub', description: '7-in-1 with HDMI and card reader', price: 45.0, stock: 40 },
  { name: '27" Monitor', description: '1440p IPS, 75 Hz', price: 279.0, stock: 12 },
  { name: 'Laptop Stand', description: 'Adjustable aluminium stand', price: 34.99, stock: 33 },
  { name: 'Webcam', description: '1080p with built-in microphone', price: 59.0, stock: 18 },
  { name: 'Noise-Cancelling Headphones', description: 'Over-ear, 30h battery', price: 199.0, stock: 9 },
  { name: 'Desk Lamp', description: 'LED, dimmable', price: 24.9, stock: 0 },
  { name: 'External SSD 1TB', description: 'USB 3.2, up to 1000 MB/s', price: 99.0, stock: 15 },
  { name: 'Phone Charger', description: '65W GaN fast charger', price: 19.99, stock: 80 },
  { name: 'HDMI Cable', description: '2 m, 4K ready', price: 9.5, stock: 120 },
  { name: 'Mouse Pad', description: 'Large, non-slip base', price: 12.0, stock: 70 },
];

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Skipping seed: the table already has ${existing} products.`);
    return;
  }
  const result = await prisma.product.createMany({ data: products });
  console.log(`Seeded ${result.count} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());