DROP TABLE IF EXISTS "devices" CASCADE;

CREATE TABLE "devices" (
  "id" char(11) NOT NULL,
  "appName" varchar(20) DEFAULT NULL,
  "deviceId" varchar(45) DEFAULT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "fcmToken" varchar(255) DEFAULT NULL,
  "label" varchar(45) DEFAULT NULL,
  "registrationDate" TIMESTAMP DEFAULT NULL,
  "lastActiveDate" TIMESTAMP DEFAULT NULL,
  "deviceInfo" text,
  "admId" varchar(255) DEFAULT NULL,
  "pairingCode" varchar(45) DEFAULT NULL,
  "ipAddress" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "devices_appName_deviceId" ON "devices" ("appName","deviceId");
CREATE INDEX IF NOT EXISTS "devices_personId_lastActiveDate" ON "devices" ("personId", "lastActiveDate");
CREATE INDEX IF NOT EXISTS "devices_fcmToken" ON "devices" ("fcmToken");
CREATE INDEX IF NOT EXISTS "devices_pairingCode" ON "devices" ("pairingCode");
