DROP TABLE IF EXISTS "campuses" CASCADE;

CREATE TABLE "campuses" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(255) DEFAULT NULL,
  "address1" varchar(50) DEFAULT NULL,
  "address2" varchar(50) DEFAULT NULL,
  "city" varchar(50) DEFAULT NULL,
  "state" varchar(10) DEFAULT NULL,
  "zip" varchar(10) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "campuses_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "campuses_churchId" ON "campuses" ("churchId");
