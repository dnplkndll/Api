DROP TABLE IF EXISTS "songs" CASCADE;

CREATE TABLE "songs" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(45) DEFAULT NULL,
  "dateAdded" date DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "songs_ix_churchId_name" ON "songs" ("churchId", "name");
