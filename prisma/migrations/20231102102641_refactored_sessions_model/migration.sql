/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[device_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token_expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token_expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expiresAt",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "access_token_expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refresh_token_expires_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_device_id_key" ON "sessions"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_access_token_key" ON "sessions"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");
