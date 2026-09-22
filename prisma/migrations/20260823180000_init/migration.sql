-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pole" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Pole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roleKind" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "profile" TEXT[],
    "headcount" INTEGER NOT NULL,
    "poleId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeApplication" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "postnom" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primaryJobId" TEXT NOT NULL,
    "secondaryJobId" TEXT,
    "educationLevel" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "professionalSituation" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "motivation" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "linkedin" TEXT,
    "cvPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommitteeApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "postnom" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "educationLevel" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "primaryTeamId" TEXT NOT NULL,
    "secondaryTeamId" TEXT,
    "skills" TEXT,
    "eventExperience" TEXT,
    "languages" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "assignmentTeamId" TEXT,
    "assignmentZone" TEXT,
    "assignmentLead" TEXT,
    "assignmentShift" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pole_slug_key" ON "Pole"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "CommitteeApplication_status_idx" ON "CommitteeApplication"("status");

-- CreateIndex
CREATE INDEX "CommitteeApplication_email_idx" ON "CommitteeApplication"("email");

-- CreateIndex
CREATE INDEX "CommitteeApplication_primaryJobId_idx" ON "CommitteeApplication"("primaryJobId");

-- CreateIndex
CREATE INDEX "VolunteerApplication_status_idx" ON "VolunteerApplication"("status");

-- CreateIndex
CREATE INDEX "VolunteerApplication_email_idx" ON "VolunteerApplication"("email");

-- CreateIndex
CREATE INDEX "VolunteerApplication_primaryTeamId_idx" ON "VolunteerApplication"("primaryTeamId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_poleId_fkey" FOREIGN KEY ("poleId") REFERENCES "Pole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeApplication" ADD CONSTRAINT "CommitteeApplication_primaryJobId_fkey" FOREIGN KEY ("primaryJobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeApplication" ADD CONSTRAINT "CommitteeApplication_secondaryJobId_fkey" FOREIGN KEY ("secondaryJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
