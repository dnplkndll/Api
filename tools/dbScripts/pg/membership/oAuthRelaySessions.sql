DROP TABLE IF EXISTS "oAuthRelaySessions" CASCADE;

CREATE TABLE "oAuthRelaySessions" (
  "id" char(11) NOT NULL,
  "sessionCode" varchar(16) NOT NULL,
  "provider" varchar(45) NOT NULL,
  "authCode" varchar(512) DEFAULT NULL,
  "redirectUri" varchar(512) NOT NULL,
  "status" varchar(50) DEFAULT 'pending',
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "oAuthRelaySessions_sessionCode" UNIQUE ("sessionCode")
);

CREATE INDEX IF NOT EXISTS "oAuthRelaySessions_status_expiresAt" ON "oAuthRelaySessions" ("status", "expiresAt");
