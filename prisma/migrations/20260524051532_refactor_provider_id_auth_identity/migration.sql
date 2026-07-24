/*
  Warnings:

  - Made the column `providerId` on table `auth_identities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "auth_identities" ALTER COLUMN "providerId" SET NOT NULL;
