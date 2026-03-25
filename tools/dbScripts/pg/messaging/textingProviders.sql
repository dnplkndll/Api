DROP TABLE IF EXISTS "textingProviders" CASCADE;

CREATE TABLE "textingProviders" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "provider" varchar(50) NOT NULL,
  "apiKey" varchar(500),
  "apiSecret" varchar(500),
  "fromNumber" varchar(20),
  "enabled" BOOLEAN DEFAULT TRUE,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "textingProviders_ix_churchId" ON "textingProviders" ("churchId");
