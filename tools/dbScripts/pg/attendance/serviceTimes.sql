DROP TABLE IF EXISTS "serviceTimes" CASCADE;

CREATE TABLE "serviceTimes" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "serviceId" char(11) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "serviceTimes_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "serviceTimes_churchId" ON "serviceTimes" ("churchId");
CREATE INDEX IF NOT EXISTS "serviceTimes_serviceId" ON "serviceTimes" ("serviceId");
CREATE INDEX IF NOT EXISTS "serviceTimes_idx_church_service_removed" ON "serviceTimes" ("churchId", "serviceId", "removed");
