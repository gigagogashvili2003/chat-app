-- CreateTable
CREATE TABLE "disabled_users" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "disabled_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disabled_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disabled_users_user_id_key" ON "disabled_users"("user_id");

-- AddForeignKey
ALTER TABLE "disabled_users" ADD CONSTRAINT "disabled_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
