DROP TABLE IF EXISTS "eventExceptions" CASCADE;

CREATE TABLE "eventExceptions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "eventId" char(11) DEFAULT NULL,
  "exceptionDate" TIMESTAMP DEFAULT NULL,
  "recurrenceDate" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);


