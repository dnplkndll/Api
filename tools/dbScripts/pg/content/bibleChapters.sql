DROP TABLE IF EXISTS "bibleChapters" CASCADE;

CREATE TABLE "bibleChapters" (
  "id" char(11) NOT NULL,
  "translationKey" varchar(45) DEFAULT NULL,
  "bookKey" varchar(45) DEFAULT NULL,
  "keyName" varchar(45) DEFAULT NULL,
  "number" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bibleChapters_ix_translationKey_bookKey" ON "bibleChapters" ("translationKey","bookKey");
