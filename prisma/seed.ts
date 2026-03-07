import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { username: "rexxeagle" },
    update: {},
    create: {
      username: "@Dayut2103",
      password,
    },
  });

  console.log({ user });

  // Seed Tags
  const tags = ["Web", "Mobile", "AI", "Frontend", "Backend"];
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  // Seed Tech Stacks
  const techStacks = [
    { name: "React", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "TailwindCSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Next.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  ];
  for (const tech of techStacks) {
    await prisma.techStack.upsert({
      where: { name: tech.name },
      update: {},
      create: { name: tech.name, iconUrl: tech.iconUrl },
    });
  }

  // Seed Profile
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    await prisma.profile.create({
      data: {
        name: "Rendi Elang",
        title: "CS Student & Developer",
        bio: "Passionate about building scalable web applications and exploring AI.",
        email: "rendi@example.com",
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
