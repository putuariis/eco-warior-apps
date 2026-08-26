import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = [
    ["Putu", 1840, 125.6, 48.2, 12850, 96], ["AyuGreen", 1610, 1180, 390, 10400, 98],
    ["MadeEco", 1510, 1102, 355, 9200, 94], ["BaliClimate", 1390, 980, 300, 8700, 91],
    ["CarbonZero", 1240, 840, 270, 7600, 89], ["WasteHunter", 1110, 760, 250, 6900, 87]
  ];
  for (const [username, xp, co2Reduced, wasteDiverted, ecoTokens, reputation] of users) {
    await prisma.user.upsert({ where: { username: username as string }, update: {}, create: { username: username as string, xp: xp as number, co2Reduced: co2Reduced as number, wasteDiverted: wasteDiverted as number, ecoTokens: ecoTokens as number, reputation: reputation as number } });
  }
  const rewards = [
    ["E-Bike Voucher", "Green Mobility", "Exclusive sustainable mobility voucher.", 5000, 2],
    ["Reusable Bottle", "Ocean Future", "Premium stainless reusable bottle.", 900, 15],
    ["Compost Kit", "Bali Circular", "Home compost starter kit.", 1800, 5],
    ["Solar Power Bank", "SunWorks", "Compact solar charging kit.", 3200, 1],
    ["Eco Bag", "Circular Lab", "Durable recycled-fiber shopping bag.", 600, 25],
    ["Tree Planting Voucher", "Forest Guardians", "Fund one native tree restoration.", 1200, 10],
    ["Transit Pass", "Green Mobility", "Sustainable public transit voucher.", 1500, 5],
    ["Zero Waste Starter Kit", "Bali Circular", "Curated zero-waste essentials.", 2600, 2]
  ];
  for (const [name, sponsor, description, cost, stock] of rewards) {
    const exists = await prisma.reward.findFirst({ where: { name: name as string } });
    if (!exists) await prisma.reward.create({ data: { name: name as string, sponsor: sponsor as string, description: description as string, cost: cost as number, stock: stock as number, initialStock: stock as number } });
  }
  const putu = await prisma.user.findUnique({ where: { username: "Putu" } });
  if (putu) {
    const existing = await prisma.action.count({ where: { userId: putu.id } });
    if (!existing) await prisma.action.createMany({ data: [
      { userId: putu.id, category: "Recycling", title: "Recycled Plastic", description: "Sorted and delivered 5 kg plastic to a recycling partner.", quantity: 5, unit: "kg", co2Reduced: 8.2, wasteDiverted: 5, xpReward: 100, tokenReward: 25, status: "VERIFIED" },
      { userId: putu.id, category: "Sustainable Transport", title: "Electric Bike Commute", description: "Replaced a short car trip with an electric bicycle.", quantity: 20, unit: "km", co2Reduced: 4.6, wasteDiverted: 0, xpReward: 80, tokenReward: 18, status: "PENDING" }
    ] });
  }
}
main().finally(() => prisma.$disconnect());
