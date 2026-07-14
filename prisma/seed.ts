import { PrismaClient, ContentType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_TEACHER_SECTIONS } from "../lib/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---- Admin user ----
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  await prisma.user.upsert({
    where: { email: "admin@learnalquranonlinebd.com" },
    update: {},
    create: {
      name: "Site Admin",
      email: "admin@learnalquranonlinebd.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      isActive: true
    }
  });

  // ---- Teacher users (admin panel accounts) ----
  const teacherUsers = [
    { name: "Hafez Mawlana Abdullah Al Mamun", email: "abdullah.mamun@learnalquranonlinebd.com" },
    { name: "Qari Muhammad Yusuf", email: "muhammad.yusuf@learnalquranonlinebd.com" },
    { name: "Ustaza Amina Khatun", email: "amina.khatun@learnalquranonlinebd.com" },
    { name: "Hafez Ibrahim Khalil", email: "ibrahim.khalil@learnalquranonlinebd.com" },
    { name: "Qari Sadiqur Rahman", email: "sadiqur.rahman@learnalquranonlinebd.com" },
    { name: "Ustaza Rukaiya Sultana", email: "rukaiya.sultana@learnalquranonlinebd.com" },
    { name: "Hafez Zubair Ahmed", email: "zubair.ahmed@learnalquranonlinebd.com" },
    { name: "Qari Nurul Islam", email: "nurul.islam@learnalquranonlinebd.com" }
  ];

  const teacherPassword = await bcrypt.hash("Teacher@12345", 10);
  for (const teacher of teacherUsers) {
    await prisma.user.upsert({
      where: { email: teacher.email },
      update: {},
      create: {
        name: teacher.name,
        email: teacher.email,
        passwordHash: teacherPassword,
        role: "TEACHER",
        isActive: true,
        permissions: DEFAULT_TEACHER_SECTIONS
      }
    });
  }

  // ---- Site settings ----
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Learn Al Quran Online BD",
      phone: "+8801234567890",
      whatsapp: "8801234567890",
      email: "info@learnalquranonlinebd.com",
      address: "Dhaka, Bangladesh",
      bkashNumber: "0123456789",
      nagadNumber: "0123456789",
      bankAccount: "Account Name: Learn Al Quran Online BD, A/C: 0000000000, Bank: -----",
      facebookUrl: "https://facebook.com/",
      youtubeUrl: "https://youtube.com/",
      googleMapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1234!2d90.4125!3d23.8103",
      ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
      copyrightText: `© ${new Date().getFullYear()} Learn Al Quran Online BD. All rights reserved.`
    }
  });

  // ---- Courses ----
  const courses = [
    {
      title: "Smart Maktab Learning",
      slug: "smart-maktab-learning",
      description:
        "A foundational course covering Arabic alphabet recognition, basic Islamic etiquette (Adab), daily duas, and introductory Quran reading for young learners.",
      duration: "6 Months",
      isFeatured: true,
      sortOrder: 1
    },
    {
      title: "Tajweed Master Course",
      slug: "tajweed-master-course",
      description:
        "Master the rules of Tajweed with proper Makhraj (articulation points) and Sifat (characteristics of letters) to recite the Quran beautifully and correctly.",
      duration: "4 Months",
      isFeatured: true,
      sortOrder: 2
    },
    {
      title: "Complete Nazera Quran",
      slug: "complete-nazera-quran",
      description:
        "Learn to read the complete Quran fluently with correct pronunciation, from Noorani Qaida to the 30th Para, under qualified Huffaz teachers.",
      duration: "12 Months",
      isFeatured: true,
      sortOrder: 3
    },
    {
      title: "Complete Hifzul Quran",
      slug: "complete-hifzul-quran",
      description:
        "A structured memorization program to help students memorize the entire Holy Quran with strong revision (Dohor) systems and one-to-one attention.",
      duration: "24-36 Months",
      isFeatured: true,
      sortOrder: 4
    },
    {
      title: "Adult Quran Learning",
      slug: "adult-quran-learning",
      description:
        "Designed specifically for adults who want to learn to read the Quran from scratch or improve their existing recitation in a comfortable, judgment-free environment.",
      duration: "6 Months",
      isFeatured: false,
      sortOrder: 5
    },
    {
      title: "English Speaking",
      slug: "english-speaking",
      description:
        "Build confidence in spoken English with practical conversation practice, grammar fundamentals, and vocabulary building for daily life and career growth.",
      duration: "3 Months",
      isFeatured: false,
      sortOrder: 6
    }
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course
    });
  }

  // ---- Teachers ----
  const teachers = [
    {
      type: ContentType.TEACHER,
      title: "Hafez Mawlana Abdullah Al Mamun",
      slug: "hafez-abdullah-al-mamun",
      subtitle: "Hifz & Tajweed Specialist",
      description: "10+ years of teaching experience with Ijazah in Quran recitation.",
      sortOrder: 1
    },
    {
      type: ContentType.TEACHER,
      title: "Qari Muhammad Yusuf",
      slug: "qari-muhammad-yusuf",
      subtitle: "Nazera & Tajweed Teacher",
      description: "Graduate of Qawmi Madrasa, specialized in beginner Quran reading.",
      sortOrder: 2
    },
    {
      type: ContentType.TEACHER,
      title: "Ustaza Amina Khatun",
      slug: "ustaza-amina-khatun",
      subtitle: "Female Students & Kids Teacher",
      description: "Specialized in teaching children and adult female students online.",
      sortOrder: 3
    }
  ];

  for (const t of teachers) {
    await prisma.content.upsert({ where: { slug: t.slug }, update: {}, create: t });
  }

  // ---- Reviews ----
  const reviews = [
    {
      type: ContentType.REVIEW,
      title: "Abdur Rahim",
      slug: "review-abdur-rahim",
      subtitle: "Parent, Sylhet",
      description:
        "My son has learned so much in just 3 months. The teachers are patient and very professional. Highly recommended for busy parents abroad.",
      data: { rating: 5 },
      sortOrder: 1
    },
    {
      type: ContentType.REVIEW,
      title: "Fatema Begum",
      slug: "review-fatema-begum",
      subtitle: "Student, UK",
      description:
        "I started as an adult with zero Quran reading knowledge. Alhamdulillah, within 4 months I can now read with proper Tajweed.",
      data: { rating: 5 },
      sortOrder: 2
    },
    {
      type: ContentType.REVIEW,
      title: "Md. Kamal Hossain",
      slug: "review-md-kamal-hossain",
      subtitle: "Parent, Dhaka",
      description:
        "Excellent one-to-one classes with flexible schedule. My daughter enjoys her Hifz classes every day.",
      data: { rating: 4 },
      sortOrder: 3
    }
  ];

  for (const r of reviews) {
    await prisma.content.upsert({ where: { slug: r.slug }, update: {}, create: r });
  }

  // ---- FAQ ----
  const faqs = [
    {
      type: ContentType.FAQ,
      title: "How do the online classes work?",
      slug: "faq-how-classes-work",
      description:
        "Classes are conducted live one-to-one or in small groups via Zoom/Google Meet with a qualified teacher, according to a schedule you choose.",
      sortOrder: 1
    },
    {
      type: ContentType.FAQ,
      title: "Do you provide a free trial class?",
      slug: "faq-free-trial",
      description:
        "Yes! We offer a completely free trial class so you can experience our teaching method before enrolling.",
      sortOrder: 2
    },
    {
      type: ContentType.FAQ,
      title: "What is the course fee?",
      slug: "faq-course-fee",
      description:
        "Our standard course fee is 1500 Taka. Payment can be made via bKash, Nagad, Rocket, Bank Transfer, or Western Union.",
      sortOrder: 3
    },
    {
      type: ContentType.FAQ,
      title: "Are the teachers qualified?",
      slug: "faq-teachers-qualified",
      description:
        "All our teachers are certified Huffaz and Qaris with years of teaching experience, verified before joining our platform.",
      sortOrder: 4
    }
  ];

  for (const f of faqs) {
    await prisma.content.upsert({ where: { slug: f.slug }, update: {}, create: f });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
