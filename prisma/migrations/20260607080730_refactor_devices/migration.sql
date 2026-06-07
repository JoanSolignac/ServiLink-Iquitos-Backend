/*
  Warnings:

  - You are about to drop the column `fmcToken` on the `Device` table. All the data in the column will be lost.
  - Added the required column `fcmToken` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "fmcToken",
ADD COLUMN     "fcmToken" TEXT NOT NULL;
