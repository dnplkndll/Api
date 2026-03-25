DROP TABLE IF EXISTS "bibleVerseTexts" CASCADE;

CREATE TABLE "bibleVerseTexts" (
  "id" char(11) NOT NULL,
  "translationKey" varchar(45) DEFAULT NULL,
  "verseKey" varchar(45) DEFAULT NULL,
  "bookKey" varchar(45) DEFAULT NULL,
  "chapterNumber" int DEFAULT NULL,
  "verseNumber" int DEFAULT NULL,
  "content" varchar(1000) DEFAULT NULL,
  "newParagraph" bit DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "bibleVerseTexts_uq_translationKey_verseKey" UNIQUE ("translationKey","verseKey")
);
CREATE INDEX IF NOT EXISTS "bibleVerseTexts_ix_translationKey_verseKey" ON "bibleVerseTexts" ("translationKey","verseKey");
