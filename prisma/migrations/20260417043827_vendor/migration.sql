-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "VendorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "farmLocation" TEXT NOT NULL,
    "certificationStatus" "CertificationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
