-- CreateTable
CREATE TABLE "produce" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "availableQuantity" INTEGER NOT NULL,

    CONSTRAINT "produce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produce_vendorId_name_key" ON "produce"("vendorId", "name");

-- AddForeignKey
ALTER TABLE "produce" ADD CONSTRAINT "produce_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
