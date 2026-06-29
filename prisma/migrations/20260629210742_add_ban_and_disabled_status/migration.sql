-- AlterEnum
ALTER TYPE "ServiceStatus" ADD VALUE 'DISABLED';

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "disabledUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bannedUntil" TIMESTAMP(3);
