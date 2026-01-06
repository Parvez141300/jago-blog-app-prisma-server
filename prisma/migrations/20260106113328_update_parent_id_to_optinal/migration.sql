-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "parent_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
