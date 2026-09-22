-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "OrganizationProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "sector" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "contactName" TEXT NOT NULL DEFAULT '',
    "contactTitle" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "professionalEmail" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationNeed" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priorityChallenge" TEXT NOT NULL DEFAULT '',
    "problemDomains" TEXT[],
    "solutionTypes" TEXT[],
    "priority" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "pilotWillingness" TEXT NOT NULL DEFAULT '',
    "budgetBand" TEXT NOT NULL DEFAULT '',
    "publicationConsent" TEXT NOT NULL DEFAULT 'DISCUSS',
    "fikiriChallenge" TEXT NOT NULL DEFAULT 'A_DISCUTER',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InnovatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "organization" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InnovatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InnovatorProject" (
    "id" TEXT NOT NULL,
    "innovatorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL DEFAULT '',
    "problemSolved" TEXT NOT NULL DEFAULT '',
    "solution" TEXT NOT NULL DEFAULT '',
    "sectors" TEXT[],
    "capabilities" TEXT[],
    "stage" TEXT NOT NULL DEFAULT '',
    "publicationConsent" TEXT NOT NULL DEFAULT 'DISCUSS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InnovatorProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "needId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rationale" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationProfile_userId_key" ON "OrganizationProfile"("userId");

-- CreateIndex
CREATE INDEX "OrganizationNeed_organizationId_idx" ON "OrganizationNeed"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationNeed_status_idx" ON "OrganizationNeed"("status");

-- CreateIndex
CREATE INDEX "OrganizationNeed_publicationConsent_idx" ON "OrganizationNeed"("publicationConsent");

-- CreateIndex
CREATE UNIQUE INDEX "InnovatorProfile_userId_key" ON "InnovatorProfile"("userId");

-- CreateIndex
CREATE INDEX "InnovatorProject_innovatorId_idx" ON "InnovatorProject"("innovatorId");

-- CreateIndex
CREATE INDEX "InnovatorProject_status_idx" ON "InnovatorProject"("status");

-- CreateIndex
CREATE INDEX "InnovatorProject_publicationConsent_idx" ON "InnovatorProject"("publicationConsent");

-- CreateIndex
CREATE UNIQUE INDEX "Match_needId_projectId_key" ON "Match"("needId", "projectId");

-- CreateIndex
CREATE INDEX "Match_needId_idx" ON "Match"("needId");

-- CreateIndex
CREATE INDEX "Match_projectId_idx" ON "Match"("projectId");

-- CreateIndex
CREATE INDEX "Match_score_idx" ON "Match"("score");

-- CreateIndex
CREATE INDEX "user_notification_userId_readAt_createdAt_idx" ON "user_notification"("userId", "readAt", "createdAt");

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationNeed" ADD CONSTRAINT "OrganizationNeed_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InnovatorProfile" ADD CONSTRAINT "InnovatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InnovatorProject" ADD CONSTRAINT "InnovatorProject_innovatorId_fkey" FOREIGN KEY ("innovatorId") REFERENCES "InnovatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_needId_fkey" FOREIGN KEY ("needId") REFERENCES "OrganizationNeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "InnovatorProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
