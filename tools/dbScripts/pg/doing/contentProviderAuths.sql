DROP TABLE IF EXISTS "contentProviderAuths" CASCADE;

CREATE TABLE "contentProviderAuths" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "ministryId" char(11) DEFAULT NULL,
  "providerId" varchar(50) DEFAULT NULL,
  "accessToken" text DEFAULT NULL,
  "refreshToken" text DEFAULT NULL,
  "tokenType" varchar(50) DEFAULT NULL,
  "expiresAt" TIMESTAMP DEFAULT NULL,
  "scope" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "contentProviderAuths_idx_ministry_provider" ON "contentProviderAuths" ("churchId", "ministryId", "providerId");
