-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('farmer', 'buyer', 'admin');

-- CreateEnum
CREATE TYPE "ProduceCategory" AS ENUM ('vegetables', 'fruits', 'grains', 'livestock', 'poultry', 'dairy', 'herbs', 'other');

-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('kg', 'g', 'ton', 'crate', 'bag', 'dozen', 'head', 'litre');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('ZAR', 'USD');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'sold', 'expired', 'pending_review', 'removed');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'contacted', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('new_listing', 'listing_sold', 'listing_expiring', 'account_verified', 'new_contact', 'admin_action');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'buyer',
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "bio" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProduceCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "QuantityUnit" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'ZAR',
    "urgency" "Urgency" NOT NULL DEFAULT 'medium',
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "photos" TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'pending_review',
    "views" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingTitle" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "farmerName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'ZAR',
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionValue" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "href" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_listingId_key" ON "favorites"("userId", "listingId");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
