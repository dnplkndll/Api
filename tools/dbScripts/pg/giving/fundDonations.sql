DROP TABLE IF EXISTS "fundDonations" CASCADE;

CREATE TABLE "fundDonations" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "donationId" char(11) DEFAULT NULL,
  "fundId" char(11) DEFAULT NULL,
  "amount" DOUBLE PRECISION DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fundDonations_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "fundDonations_idx_church_donation" ON "fundDonations" ("churchId", "donationId");
CREATE INDEX IF NOT EXISTS "fundDonations_idx_church_fund" ON "fundDonations" ("churchId", "fundId");
