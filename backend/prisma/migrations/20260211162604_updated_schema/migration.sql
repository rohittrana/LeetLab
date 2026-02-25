/*
  Warnings:

  - You are about to drop the column `updateAt` on the `ProblemSolved` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `sterr` on the `TestCaseResult` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ProblemSolved` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TLE', 'RUNTIME_ERROR', 'COMPILATION_ERROR');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProblemInPlaylist" ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "ProblemSolved" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "Status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "sterr",
ADD COLUMN     "stderr" TEXT;

-- CreateIndex
CREATE INDEX "Playlist_userId_idx" ON "Playlist"("userId");

-- CreateIndex
CREATE INDEX "Problem_userId_idx" ON "Problem"("userId");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- CreateIndex
CREATE INDEX "ProblemInPlaylist_playListId_idx" ON "ProblemInPlaylist"("playListId");

-- CreateIndex
CREATE INDEX "ProblemInPlaylist_problemId_idx" ON "ProblemInPlaylist"("problemId");

-- CreateIndex
CREATE INDEX "ProblemSolved_userId_idx" ON "ProblemSolved"("userId");

-- CreateIndex
CREATE INDEX "ProblemSolved_problemId_idx" ON "ProblemSolved"("problemId");

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "Submission"("userId");

-- CreateIndex
CREATE INDEX "Submission_problemId_idx" ON "Submission"("problemId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
