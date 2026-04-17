-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postContent" TEXT NOT NULL,
    "postDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
