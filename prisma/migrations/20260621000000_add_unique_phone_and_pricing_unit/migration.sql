-- AlterTable: make price nullable and add pricingUnit to services
ALTER TABLE "services" ALTER COLUMN "price" DROP NOT NULL;
ALTER TABLE "services" ADD COLUMN "pricingUnit" TEXT;

-- CreateIndex: unique phone in profiles
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");
