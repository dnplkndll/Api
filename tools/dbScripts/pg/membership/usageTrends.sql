DROP TABLE IF EXISTS "usageTrends" CASCADE;

CREATE TABLE "usageTrends" (
  "id" char(11) NOT NULL,
  "year" INTEGER DEFAULT NULL,
  "week" INTEGER DEFAULT NULL,
  "b1Users" INTEGER DEFAULT NULL,
  "b1Churches" INTEGER DEFAULT NULL,
  "b1Devices" INTEGER DEFAULT NULL,
  "chumsUsers" INTEGER DEFAULT NULL,
  "chumsChurches" INTEGER DEFAULT NULL,
  "lessonsUsers" INTEGER DEFAULT NULL,
  "lessonsChurches" INTEGER DEFAULT NULL,
  "lessonsDevices" INTEGER DEFAULT NULL,
  "freeShowDevices" INTEGER DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "usageTrends_year_week" UNIQUE ("year","week")
); 