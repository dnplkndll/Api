DROP TABLE IF EXISTS "households" CASCADE;

CREATE TABLE "households" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "households_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "households_churchId" ON "households" ("churchId");
