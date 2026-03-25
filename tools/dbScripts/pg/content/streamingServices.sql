DROP TABLE IF EXISTS "streamingServices" CASCADE;
CREATE TABLE "streamingServices" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "serviceTime" TIMESTAMP DEFAULT NULL,
  "earlyStart" INTEGER DEFAULT NULL,
  "chatBefore" INTEGER DEFAULT NULL,
  "chatAfter" INTEGER DEFAULT NULL,
  "provider" varchar(45) DEFAULT NULL,
  "providerKey" varchar(255) DEFAULT NULL,
  "videoUrl" varchar(5000) DEFAULT NULL,
  "timezoneOffset" INTEGER DEFAULT NULL,
  "recurring" BOOLEAN DEFAULT NULL,
  "label" varchar(255) DEFAULT NULL,
  "sermonId" char(11) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "streamingServices_id_UNIQUE" UNIQUE ("id")
);
