-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);
