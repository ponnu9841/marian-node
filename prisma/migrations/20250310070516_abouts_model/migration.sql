-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_badge" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);
