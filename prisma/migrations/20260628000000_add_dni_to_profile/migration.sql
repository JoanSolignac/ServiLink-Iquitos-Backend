-- AlterTable: add dni column to profiles (nullable first to handle existing rows)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "dni" TEXT;

-- Assign sequential unique placeholder DNIs to ALL existing dev rows (overwrite any bad placeholder)
UPDATE "profiles" p
SET "dni" = sub.padded
FROM (
  SELECT "userId", LPAD(ROW_NUMBER() OVER (ORDER BY "createdAt")::TEXT, 8, '0') AS padded
  FROM "profiles"
) sub
WHERE p."userId" = sub."userId";

-- Make column NOT NULL
ALTER TABLE "profiles" ALTER COLUMN "dni" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_dni_key" ON "profiles"("dni");
