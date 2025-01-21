import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cities = [
    { title: 'Astana', name: 'Астана' },
    { title: 'Almaty', name: 'Алматы' },
    { title: 'Shymkent', name: 'Шымкент' },
    { title: 'Aktobe', name: 'Актобе' },
    { title: 'Karaganda', name: 'Караганда' },
    { title: 'Taraz', name: 'Тараз' },
    { title: 'Pavlodar', name: 'Павлодар' },
    { title: 'Ust-Kamenogorsk', name: 'Өскемен' },
    { title: 'Semey', name: 'Семей' },
    { title: 'Aktau', name: 'Актау' },
    { title: 'Atyrau', name: 'Атырау' },
    { title: 'Kostanay', name: 'Костанай' },
    { title: 'Kyzylorda', name: 'Қызылорда' },
    { title: 'Oral', name: 'Орал' },
    { title: 'Petropavlovsk', name: 'Петропавлоск' },
    { title: 'Turkistan', name: 'Түркістан' },
  ];

  console.log('Start seeding...');
  for (const city of cities) {
    await prisma.city.create({
      data: city,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
