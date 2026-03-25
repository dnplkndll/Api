DROP TABLE IF EXISTS "notificationPreferences" CASCADE;

CREATE TABLE "notificationPreferences" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "allowPush" BOOLEAN DEFAULT NULL,
  "emailFrequency" varchar(10) DEFAULT NULL,
  PRIMARY KEY ("id")
); 