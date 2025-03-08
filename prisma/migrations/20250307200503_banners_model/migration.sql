-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
