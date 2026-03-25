DROP TABLE IF EXISTS "assignments" CASCADE;

CREATE TABLE "assignments" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "positionId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "status" varchar(45) DEFAULT NULL,
  "notified" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "assignments_idx_church_person" ON "assignments" ("churchId", "personId");
CREATE INDEX IF NOT EXISTS "assignments_idx_position" ON "assignments" ("positionId");
