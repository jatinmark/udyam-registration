-- CreateTable
CREATE TABLE "public"."udyam_registrations" (
    "id" SERIAL NOT NULL,
    "aadhaar" TEXT NOT NULL,
    "nameAsPerAadhaar" TEXT NOT NULL,
    "typeOfOrganisation" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "socialCategory" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "speciallyAbled" BOOLEAN NOT NULL,
    "nameOfEnterprise" TEXT NOT NULL,
    "majorActivity" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "udyam_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "udyam_registrations_aadhaar_key" ON "public"."udyam_registrations"("aadhaar");

-- CreateIndex
CREATE UNIQUE INDEX "udyam_registrations_pan_key" ON "public"."udyam_registrations"("pan");

-- CreateIndex
CREATE UNIQUE INDEX "udyam_registrations_registrationNumber_key" ON "public"."udyam_registrations"("registrationNumber");
