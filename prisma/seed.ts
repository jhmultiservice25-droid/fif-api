import { PrismaClient } from "@prisma/client";
import { JOBS } from "./catalog/jobs";
import { POLES } from "./catalog/poles";

const prisma = new PrismaClient();

async function main() {
  for (const pole of POLES) {
    await prisma.pole.upsert({
      where: { id: pole.id },
      update: {
        slug: pole.slug,
        name: pole.name,
        shortName: pole.shortName,
        description: pole.description,
        order: pole.order,
      },
      create: {
        id: pole.id,
        slug: pole.slug,
        name: pole.name,
        shortName: pole.shortName,
        description: pole.description,
        order: pole.order,
      },
    });
  }

  for (const job of JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        slug: job.slug,
        title: job.title,
        roleKind: job.roleKind,
        mission: job.mission,
        responsibilities: job.responsibilities,
        profile: job.profile,
        headcount: job.headcount,
        poleId: job.poleId,
      },
      create: {
        id: job.id,
        slug: job.slug,
        title: job.title,
        roleKind: job.roleKind,
        mission: job.mission,
        responsibilities: job.responsibilities,
        profile: job.profile,
        headcount: job.headcount,
        poleId: job.poleId,
      },
    });
  }

  console.log(`Seeded ${POLES.length} poles, ${JOBS.length} jobs`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
