/*
  Warnings:

  - You are about to drop the column `endDate` on the `rental_bookings` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `rental_bookings` table. All the data in the column will be lost.
  - Added the required column `duration` to the `rental_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_bookings" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "duration" INTEGER NOT NULL;
