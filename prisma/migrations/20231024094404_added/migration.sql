-- CreateTable
CREATE TABLE "deactivated_users" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deactivated_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deactivated_users_user_id_key" ON "deactivated_users"("user_id");

-- AddForeignKey
ALTER TABLE "deactivated_users" ADD CONSTRAINT "deactivated_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
