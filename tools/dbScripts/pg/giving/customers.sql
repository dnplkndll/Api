DROP TABLE IF EXISTS "customers" CASCADE;

CREATE TABLE "customers" (
  "id" varchar(255) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "provider" varchar(50) DEFAULT NULL,
  "metadata" json DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "customers_id_UNIQUE" UNIQUE ("id")
);
