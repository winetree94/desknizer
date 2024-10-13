-- CreateTable
CREATE TABLE "Extension" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Entities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "extensionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    CONSTRAINT "UserExtension_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "Extension" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserExtension_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserExtensionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "extensionId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "UserExtensionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserExtensionItem_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "Entities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserWidget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "extensionId" TEXT NOT NULL,
    "extensionItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    CONSTRAINT "UserWidget_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "Entities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserWidget_extensionItemId_fkey" FOREIGN KEY ("extensionItemId") REFERENCES "UserExtensionItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
