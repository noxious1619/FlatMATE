import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// 🔥 ESM-safe replacements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CollegeInput = {
  name: string;
  city: string;
  state: string;
};

async function geocodeCollege(college: CollegeInput) {
  const query = encodeURIComponent(
    `${college.name}, ${college.city}, ${college.state}, India`
  );

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
    {
      headers: {
        "User-Agent": "flatmates-seed-script",
      },
    }
  );

  const data = await res.json();

  if (!data.length) {
    console.warn(`⚠️ No location found for ${college.name}`);
    return null;
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}

async function main() {
  const filePath = path.join(__dirname, "data", "colleges.json");
  const colleges: CollegeInput[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  for (const college of colleges) {
    const coords = await geocodeCollege(college);
    if (!coords) continue;

    await prisma.college.upsert({
      where: {
        name_city: {
          name: college.name,
          city: college.city,
        },
      },
      update: {},
      create: {
        name: college.name,
        city: college.city,
        state: college.state,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });

    console.log(`✅ Seeded: ${college.name}`);
    await new Promise((r) => setTimeout(r, 1000)); // Nominatim rate-limit
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
