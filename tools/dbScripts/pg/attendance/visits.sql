DROP TABLE IF EXISTS "visits" CASCADE;

CREATE TABLE "visits" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "serviceId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "visitDate" TIMESTAMP DEFAULT NULL,
  "checkinTime" TIMESTAMP DEFAULT NULL,
  "addedBy" char(11) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "visits_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "visits_churchId" ON "visits" ("churchId");
CREATE INDEX IF NOT EXISTS "visits_personId" ON "visits" ("personId");
CREATE INDEX IF NOT EXISTS "visits_serviceId" ON "visits" ("serviceId");
CREATE INDEX IF NOT EXISTS "visits_groupId" ON "visits" ("groupId");
CREATE INDEX IF NOT EXISTS "visits_idx_church_visit_date" ON "visits" ("churchId", "visitDate");
CREATE INDEX IF NOT EXISTS "visits_idx_church_person" ON "visits" ("churchId", "personId");
