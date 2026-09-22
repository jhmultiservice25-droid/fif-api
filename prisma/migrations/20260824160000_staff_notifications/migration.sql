-- CreateTable
CREATE TABLE "staff_notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staff_notification_readAt_createdAt_idx" ON "staff_notification"("readAt", "createdAt");
