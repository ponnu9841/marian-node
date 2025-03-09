-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "location" TEXT,
    "contactno_one" TEXT NOT NULL,
    "contactno_two" TEXT,
    "email_one" TEXT NOT NULL,
    "email_two" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
