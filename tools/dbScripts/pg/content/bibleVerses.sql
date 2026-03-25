DROP TABLE IF EXISTS "bibleVerses" CASCADE;

CREATE TABLE "bibleVerses" (
  "id" char(11) NOT NULL,
  "translationKey" varchar(45) DEFAULT NULL,
  "chapterKey" varchar(45) DEFAULT NULL,
  "keyName" varchar(45) DEFAULT NULL,
  "number" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bibleVerses_ix_translationKey_chapterKey" ON "bibleVerses" ("translationKey","chapterKey");
