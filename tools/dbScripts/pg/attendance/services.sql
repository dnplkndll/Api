DROP TABLE IF EXISTS "services" CASCADE;

CREATE TABLE "services" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "campusId" char(11) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "services_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "services_churchId" ON "services" ("churchId");
CREATE INDEX IF NOT EXISTS "services_campusId" ON "services" ("campusId");
