DROP TABLE IF EXISTS "events" CASCADE;

CREATE TABLE "events" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "allDay" BOOLEAN DEFAULT NULL,
  "start" TIMESTAMP DEFAULT NULL,
  "end" TIMESTAMP DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "description" TEXT,
  "visibility" varchar(45) DEFAULT NULL,
  "recurrenceRule" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "events_ix_churchId_groupId" ON "events" ("churchId", "groupId");
