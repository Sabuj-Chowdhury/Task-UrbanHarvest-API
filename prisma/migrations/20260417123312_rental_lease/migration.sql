-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "rental_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rentalSpaceId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_rentalSpaceId_fkey" FOREIGN KEY ("rentalSpaceId") REFERENCES "rentalSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
