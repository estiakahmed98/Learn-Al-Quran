"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";

type Book = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  data: unknown;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type BooksApiResponse = {
  success: boolean;
  message: string;
  count: number;
  data: Book[];
};

const BOOKS_PER_PAGE = 12;

function normalizeImageUrl(image: string | null): string | null {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return image.startsWith("/") ? image : `/${image}`;
}

function truncateWords(text: string | null, wordLimit = 10) {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return text.trim();
  }

  return `${words.slice(0, wordLimit).join(" ")}...`;
}

function stripHtml(value: string | null) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BooksClient() {
  const t = useTranslations("sitePages.books");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/books", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const result = (await response.json()) as BooksApiResponse;

      if (!response.ok) {
        throw new Error(
          result.message || `Unable to load books. Status: ${response.status}`,
        );
      }

      if (!result.success) {
        throw new Error(result.message || "Unable to load books.");
      }

      if (!Array.isArray(result.data)) {
        throw new Error("Invalid books API response.");
      }

      setBooks(result.data);
    } catch (error) {
      console.error("Books API error:", error);

      setBooks([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("unableToLoad"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedBook) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedBook(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedBook]);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return books;
    }

    return books.filter((book) => {
      const searchableText = [
        book.title,
        book.subtitle ?? "",
        stripHtml(book.description),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [books, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / BOOKS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;

    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage]);

  const paginationItems = useMemo(() => {
    const items: Array<number | "ellipsis-left" | "ellipsis-right"> = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) {
        items.push(page);
      }

      return items;
    }

    items.push(1);

    if (currentPage > 4) {
      items.push("ellipsis-left");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page += 1) {
      items.push(page);
    }

    if (currentPage < totalPages - 3) {
      items.push("ellipsis-right");
    }

    items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  function changePage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/[0.045] via-white to-white">
      {/* Compact Page Header */}
      <section className="relative overflow-hidden border-b border-gold/10">
        {/* Islamic geometric background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
          radial-gradient(
            circle at 12% 18%,
            rgba(212, 175, 55, 0.16) 0%,
            transparent 30%
          ),
          radial-gradient(
            circle at 88% 78%,
            rgba(212, 175, 55, 0.12) 0%,
            transparent 32%
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            transparent 26px,
            rgba(212, 175, 55, 0.07) 26px,
            rgba(212, 175, 55, 0.07) 27px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent 0px,
            transparent 26px,
            rgba(212, 175, 55, 0.07) 26px,
            rgba(212, 175, 55, 0.07) 27px
          )
        `,
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
          repeating-linear-gradient(
            60deg,
            transparent 0px,
            transparent 48px,
            rgba(212, 175, 55, 0.03) 48px,
            rgba(212, 175, 55, 0.03) 49px
          ),
          repeating-linear-gradient(
            -60deg,
            transparent 0px,
            transparent 48px,
            rgba(212, 175, 55, 0.03) 48px,
            rgba(212, 175, 55, 0.03) 49px
          )
        `,
            }}
          />
        </div>

        {/* Small decorative shapes */}
        <div className="pointer-events-none absolute -left-12 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border-[12px] border-primary-dark/[0.03] lg:block" />

        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-gold/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-gold/30">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-sm text-gold">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-[10px] text-gold/30">✦</span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark shadow-sm backdrop-blur-sm sm:text-xs">
              <BookOpen className="h-3.5 w-3.5 text-gold" />
              {t("badge")}
            </span>

            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-primary-dark sm:text-3xl lg:text-4xl">
              {t("title")}
            </h1>

            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-7 bg-gold/30" />
              <span className="h-1 w-3 rounded-full bg-gold" />
              <span className="h-px w-7 bg-gold/30" />
            </div>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-gray-600 sm:text-sm">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -left-32 top-40 hidden h-[26rem] w-[26rem] rounded-full border-[30px] border-primary-dark/[0.035] lg:block" />

      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full border-[22px] border-gold/[0.045]" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full border-[18px] border-gold/[0.035]" />

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Search toolbar */}
        <div className="rounded-2xl border border-gold/15 bg-white/90 p-4 shadow-lg shadow-primary/5 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-12 pr-12 text-sm text-primary-dark outline-none transition-all placeholder:text-gray-400 focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/10 sm:h-13"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-dark"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {!isLoading && !errorMessage && (
              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <p className="text-sm text-gray-500">
                  {t("showing")}{" "}
                  <span className="font-semibold text-primary-dark">
                    {paginatedBooks.length}
                  </span>{" "}
                  {t("of")}{" "}
                  <span className="font-semibold text-primary-dark">
                    {filteredBooks.length}
                  </span>{" "}
                  {t("booksLabel")}
                </p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-sm font-semibold text-gold transition-colors hover:text-primary-dark"
                  >
                    {t("clearSearch")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main states */}
        {isLoading ? (
          <LoadingState t={t} />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={() => void loadBooks()} t={t} />
        ) : filteredBooks.length === 0 ? (
          <NoResultsState
            hasSearch={Boolean(searchQuery)}
            onClear={() => setSearchQuery("")}
            t={t}
          />
        ) : (
          <>
            {/* Books grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={index}
                  onOpen={() => setSelectedBook(book)}
                  t={t}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Books pagination"
                className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-gold/10 pt-8 sm:flex-row"
              >
                <p className="text-sm text-gray-500">
                  {t("page")}{" "}
                  <span className="font-semibold text-primary-dark">
                    {currentPage}
                  </span>{" "}
                  {t("pageOf")}{" "}
                  <span className="font-semibold text-primary-dark">
                    {totalPages}
                  </span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-gold/40 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("previous")}</span>
                  </button>

                  {paginationItems.map((item) => {
                    if (item === "ellipsis-left" || item === "ellipsis-right") {
                      return (
                        <span
                          key={item}
                          className="flex h-10 w-8 items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = item === currentPage;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => changePage(item)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-gold/40 hover:bg-gold/5 hover:text-primary-dark"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-gold/40 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">{t("next")}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>

      {/* Book details modal */}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          t={t}
        />
      )}
    </main>
  );
}

function BookCard({
  book,
  index,
  onOpen,
  t,
}: {
  book: Book;
  index: number;
  onOpen: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const imageUrl = normalizeImageUrl(book.image);
  const cleanDescription = stripHtml(book.description);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white/95 shadow-sm outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-4 focus-visible:ring-gold/20"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/[0.06] via-gold/[0.07] to-primary-dark/[0.08] p-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-md">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={book.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <BookPlaceholder title={book.title} />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center p-4 transition-transform duration-300 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-primary-dark shadow-lg backdrop-blur-sm">
              <Eye className="h-4 w-4 text-gold" />
              {t("viewDetails")}
            </span>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 font-heading text-lg font-bold leading-7 text-primary-dark transition-colors group-hover:text-primary">
          {book.title}
        </h2>

        {book.subtitle && (
          <p className="mt-1.5 line-clamp-1 text-sm font-medium text-gold-dark">
            {book.subtitle}
          </p>
        )}

        {cleanDescription && (
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {truncateWords(cleanDescription, 10)}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs font-medium text-gray-500">
              {t("viewCompleteInfo")}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.07] text-primary transition-all duration-300 group-hover:bg-gold group-hover:text-primary-dark">
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function BookDetailsModal({
  book,
  onClose,
  t,
}: {
  book: Book;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const imageUrl = normalizeImageUrl(book.image);
  const cleanDescription = stripHtml(book.description);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close book details"
        onClick={onClose}
        className="absolute inset-0 bg-primary-dark/70 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl sm:rounded-3xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {t("bookDetails")}
            </p>

            <h2
              id="book-modal-title"
              className="mt-1 line-clamp-1 font-heading text-lg font-bold text-primary-dark sm:text-xl"
            >
              {book.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-all hover:border-gold/30 hover:bg-gold/10 hover:text-primary-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto">
          <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
            {/* Cover */}
            <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/[0.08] via-gold/[0.08] to-primary-dark/[0.1] p-6 sm:p-8 lg:min-h-[560px]">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent 0px,
                      transparent 20px,
                      rgba(212, 175, 55, 0.8) 20px,
                      rgba(212, 175, 55, 0.8) 21px
                    ),
                    repeating-linear-gradient(
                      -45deg,
                      transparent 0px,
                      transparent 20px,
                      rgba(212, 175, 55, 0.8) 20px,
                      rgba(212, 175, 55, 0.8) 21px
                    )
                  `,
                }}
              />

              <div className="relative z-10 w-full max-w-[280px]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="aspect-[3/4] w-full rounded-xl object-cover shadow-2xl ring-1 ring-black/10"
                  />
                ) : (
                  <BookPlaceholder title={book.title} />
                )}

                <div className="absolute -bottom-5 left-6 right-6 h-10 rounded-full bg-black/20 blur-2xl" />
              </div>
            </div>

            {/* Details */}
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute right-8 top-8 hidden h-16 w-16 opacity-25 sm:block">
                <div className="absolute inset-0 rotate-45 border border-gold/50" />
                <div className="absolute inset-4 rotate-45 border border-gold/50" />
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                <BookOpen className="h-3.5 w-3.5" />
                {t("islamicBook")}
              </span>

              <h3 className="mt-5 max-w-2xl font-heading text-2xl font-bold leading-tight text-primary-dark sm:text-3xl">
                {book.title}
              </h3>

              {book.subtitle && (
                <p className="mt-3 text-base font-semibold leading-7 text-gold-dark sm:text-lg">
                  {book.subtitle}
                </p>
              )}

              <div className="my-6 h-px bg-gradient-to-r from-gold/30 via-gray-100 to-transparent" />

              {cleanDescription ? (
                <div>
                  <h4 className="font-heading text-base font-bold text-primary-dark">
                    {t("description")}
                  </h4>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                    {cleanDescription}
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500">
                  {t("noDescription")}
                </p>
              )}

              <div className="mt-8 rounded-2xl border border-gold/15 bg-primary/[0.035] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <BookOpen className="h-5 w-5 text-gold-dark" />
                  </div>

                  <div>
                    <p className="font-semibold text-primary-dark">
                      {t("recommendedTitle")}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {t("recommendedBody")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-gray-100" />

          <div className="mt-5 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-100" />

          <div className="mt-5 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}

      <div className="sr-only">
        <LoaderCircle className="animate-spin" />
        {t("loadingBooks")}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  t,
}: {
  message: string;
  onRetry: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>

      <h2 className="mt-5 font-heading text-xl font-bold text-primary-dark">
        {t("unableToLoad")}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <RefreshCcw className="h-4 w-4" />
        {t("tryAgain")}
      </button>
    </div>
  );
}

function NoResultsState({
  hasSearch,
  onClear,
  t,
}: {
  hasSearch: boolean;
  onClear: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-gold/30 bg-white/90 px-6 py-14 text-center shadow-lg shadow-primary/5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
        {hasSearch ? (
          <Search className="h-7 w-7 text-gold-dark" />
        ) : (
          <BookOpen className="h-7 w-7 text-gold-dark" />
        )}
      </div>

      <h2 className="mt-5 font-heading text-xl font-bold text-primary-dark">
        {hasSearch ? t("noMatchingTitle") : t("noBooksTitle")}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch ? t("noMatchingBody") : t("noBooksBody")}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {t("clearSearch")}
        </button>
      )}
    </div>
  );
}

function BookPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        <BookOpen className="h-7 w-7 text-gold" />
      </div>

      <p className="mt-5 line-clamp-4 font-heading text-lg font-bold leading-7 text-white">
        {title}
      </p>
    </div>
  );
}
