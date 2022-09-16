/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPreference` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "age" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "userPrefenerenceId" TEXT,
    CONSTRAINT "User_userPrefenerenceId_fkey" FOREIGN KEY ("userPrefenerenceId") REFERENCES "UserPreference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "email", "id", "isAdmin", "name") SELECT "age", "email", "id", "isAdmin", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userPrefenerenceId_key" ON "User"("userPrefenerenceId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE UNIQUE INDEX "User_age_name_key" ON "User"("age", "name");
CREATE TABLE "new_UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emailUpdates" BOOLEAN NOT NULL
);
INSERT INTO "new_UserPreference" ("emailUpdates", "id") SELECT "emailUpdates", "id" FROM "UserPreference";
DROP TABLE "UserPreference";
ALTER TABLE "new_UserPreference" RENAME TO "UserPreference";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
