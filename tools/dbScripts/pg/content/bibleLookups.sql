DROP TABLE IF EXISTS "bibleLookups" CASCADE;

CREATE TABLE "bibleLookups" (
  "id" char(11) NOT NULL,
  "translationKey" varchar(45) DEFAULT NULL,
  "lookupTime" TIMESTAMP DEFAULT NULL,
  "ipAddress" varchar(45) DEFAULT NULL,
  "startVerseKey" varchar(15) DEFAULT NULL,
  "endVerseKey" varchar(15) DEFAULT NULL,
  PRIMARY KEY ("id")
);
