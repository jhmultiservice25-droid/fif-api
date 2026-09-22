-- CreateTable
CREATE TABLE "ParticipantRegistration" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "postnom" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "selectedDays" TEXT[],
    "selectedActivities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParticipantRegistration_email_idx" ON "ParticipantRegistration"("email");

-- CreateIndex
CREATE INDEX "ParticipantRegistration_createdAt_idx" ON "ParticipantRegistration"("createdAt");
