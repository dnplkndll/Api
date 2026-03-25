DROP TABLE IF EXISTS "donationBatches" CASCADE;

CREATE TABLE "donationBatches" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "batchDate" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "donationBatches_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "donationBatches_idx_church_id" ON "donationBatches" ("churchId");
