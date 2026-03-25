DROP TABLE IF EXISTS "curatedEvents" CASCADE;

CREATE TABLE "curatedEvents" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "curatedCalendarId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "eventId" char(11) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "curatedEvents_ix_churchId_curatedCalendarId" ON "curatedEvents" ("churchId", "curatedCalendarId");
