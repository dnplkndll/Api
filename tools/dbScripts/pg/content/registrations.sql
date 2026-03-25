DROP TABLE IF EXISTS "registrations" CASCADE;
CREATE TABLE "registrations" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "eventId" char(11) NOT NULL,
  "personId" char(11) DEFAULT NULL,
  "householdId" char(11) DEFAULT NULL,
  "status" varchar(20) DEFAULT 'pending',
  "formSubmissionId" char(11) DEFAULT NULL,
  "notes" TEXT DEFAULT NULL,
  "registeredDate" TIMESTAMP DEFAULT NULL,
  "cancelledDate" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "registrations_ix_registrations_churchId_eventId" ON "registrations" ("churchId", "eventId");
CREATE INDEX IF NOT EXISTS "registrations_ix_registrations_personId" ON "registrations" ("personId");
CREATE INDEX IF NOT EXISTS "registrations_ix_registrations_householdId" ON "registrations" ("householdId");
