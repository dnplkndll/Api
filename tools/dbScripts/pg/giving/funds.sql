DROP TABLE IF EXISTS "funds" CASCADE;

CREATE TABLE "funds" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  "productId" varchar(50) DEFAULT NULL,
  "taxDeductible" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "funds_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "funds_idx_church_removed" ON "funds" ("churchId", "removed");
