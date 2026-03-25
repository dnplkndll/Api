DROP TABLE IF EXISTS "settings" CASCADE;

CREATE TABLE "settings" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "userId" char(11) DEFAULT NULL,
  "keyName" varchar(255) DEFAULT NULL,
  "value" TEXT,
  "public" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "settings_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "settings_churchId" ON "settings" ("churchId");
