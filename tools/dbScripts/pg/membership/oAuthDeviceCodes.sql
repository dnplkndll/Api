DROP TABLE IF EXISTS "oAuthDeviceCodes" CASCADE;

CREATE TABLE "oAuthDeviceCodes" (
  "id" char(11) NOT NULL,
  "deviceCode" varchar(64) NOT NULL,
  "userCode" varchar(16) NOT NULL,
  "clientId" varchar(45) NOT NULL,
  "scopes" varchar(255) DEFAULT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "pollInterval" int DEFAULT 5,
  "status" varchar(50) DEFAULT 'pending',
  "approvedByUserId" char(11) DEFAULT NULL,
  "userChurchId" char(11) DEFAULT NULL,
  "churchId" char(11) DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "oAuthDeviceCodes_deviceCode" UNIQUE ("deviceCode")
);

CREATE INDEX IF NOT EXISTS "oAuthDeviceCodes_userCode_status" ON "oAuthDeviceCodes" ("userCode", "status");
CREATE INDEX IF NOT EXISTS "oAuthDeviceCodes_status_expiresAt" ON "oAuthDeviceCodes" ("status", "expiresAt");
