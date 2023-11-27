-- CreateTable
CREATE TABLE "followers" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "followee_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "followers_follower_id_followee_id_key" ON "followers"("follower_id", "followee_id");

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
