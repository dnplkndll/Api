DROP TABLE IF EXISTS "groupServiceTimes" CASCADE;

CREATE TABLE "groupServiceTimes" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "serviceTimeId" char(11) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "groupServiceTimes_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "groupServiceTimes_churchId" ON "groupServiceTimes" ("churchId");
CREATE INDEX IF NOT EXISTS "groupServiceTimes_groupId" ON "groupServiceTimes" ("groupId");
CREATE INDEX IF NOT EXISTS "groupServiceTimes_serviceTimeId" ON "groupServiceTimes" ("serviceTimeId");
