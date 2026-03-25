DROP TABLE IF EXISTS "donations" CASCADE;

CREATE TABLE "donations" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "batchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "donationDate" TIMESTAMP DEFAULT NULL,
  "amount" DOUBLE PRECISION DEFAULT NULL,
  "currency" varchar(10) DEFAULT NULL,
  "method" varchar(50) DEFAULT NULL,
  "methodDetails" varchar(255) DEFAULT NULL,
  "notes" text,
  "entryTime" TIMESTAMP DEFAULT NULL,
  "status" varchar(20) DEFAULT 'complete',
  "transactionId" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "donations_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "donations_idx_church_donation_date" ON "donations" ("churchId", "donationDate");
CREATE INDEX IF NOT EXISTS "donations_idx_church_person" ON "donations" ("churchId", "personId");
CREATE INDEX IF NOT EXISTS "donations_idx_church_batch" ON "donations" ("churchId", "batchId");
CREATE INDEX IF NOT EXISTS "donations_idx_church_method" ON "donations" ("churchId", "method", "methodDetails");
CREATE INDEX IF NOT EXISTS "donations_idx_church_status" ON "donations" ("churchId", "status");
CREATE INDEX IF NOT EXISTS "donations_idx_transaction" ON "donations" ("transactionId");
