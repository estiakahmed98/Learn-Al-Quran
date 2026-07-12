import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Islamic Books",
  description:
    "Browse recommended Quran learning books, Tajweed guides, and Islamic study materials used in our online madrasa courses.",
  alternates: { canonical: "/books" }
};

export const revalidate = 3600;

export default async function BooksPage() {
  const books = await prisma.content
    .findMany({ where: { type: "BOOK", isPublished: true }, orderBy: { sortOrder: "asc" } })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-semibold uppercase tracking-wide text-secondary">Books</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">
          Recommended Islamic &amp; Quran Learning Books
        </h1>
        <p className="mt-4 text-gray-600">
          Our teachers recommend these books and study materials to complement your Quran and
          Tajweed learning journey.
        </p>
      </div>

      {books.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">
          Our book collection is being updated. Please check back soon, or contact us for
          recommended reading material.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <div key={book.id} className="rounded-2xl border border-gold/20 bg-white p-4 shadow-sm">
              {book.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.image}
                  alt={book.title}
                  className="aspect-[3/4] w-full rounded-lg object-cover"
                />
              )}
              <h3 className="mt-3 font-heading font-bold text-primary-dark">{book.title}</h3>
              {book.subtitle && <p className="text-sm text-secondary">{book.subtitle}</p>}
              {book.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{book.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
