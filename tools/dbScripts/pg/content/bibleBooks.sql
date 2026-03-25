DROP TABLE IF EXISTS "bibleBooks" CASCADE;

CREATE TABLE "bibleBooks" (
  "id" char(11) NOT NULL,
  "translationKey" varchar(45) DEFAULT NULL,
  "keyName" varchar(45) DEFAULT NULL,
  "abbreviation" varchar(45) DEFAULT NULL,
  "name" varchar(45) DEFAULT NULL,
  "sort" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "bibleBooks_ix_translationKey" ON "bibleBooks" ("translationKey");
