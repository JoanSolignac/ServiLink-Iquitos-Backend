-- Step 1: Drop foreign keys that reference service_requests from ratings
ALTER TABLE "ratings" DROP CONSTRAINT IF EXISTS "ratings_serviceRequestId_fkey";

-- Step 2: Drop the unique index on serviceRequestId
DROP INDEX IF EXISTS "ratings_serviceRequestId_key";

-- Step 3: Drop the serviceRequestId column (may contain data, forced)
ALTER TABLE "ratings" DROP COLUMN IF EXISTS "serviceRequestId";

-- Step 4: Add updatedAt column with default for existing rows, then keep as NOT NULL
ALTER TABLE "ratings" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 5: Drop foreign key constraints on service_requests table before dropping it
ALTER TABLE "ratings" DROP CONSTRAINT IF EXISTS "ratings_serviceId_fkey";
ALTER TABLE "ratings" DROP CONSTRAINT IF EXISTS "ratings_customerId_fkey";
ALTER TABLE "service_requests" DROP CONSTRAINT IF EXISTS "service_requests_serviceId_fkey";
ALTER TABLE "service_requests" DROP CONSTRAINT IF EXISTS "service_requests_customerId_fkey";

-- Step 6: Drop the service_requests table
DROP TABLE IF EXISTS "service_requests";

-- Step 7: Re-add foreign keys for ratings with CASCADE
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 8: Add unique constraint for one rating per user per service
CREATE UNIQUE INDEX "ratings_serviceId_customerId_key" ON "ratings"("serviceId", "customerId");
