DROP TABLE IF EXISTS "domains" CASCADE;

CREATE TABLE "domains" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "domainName" varchar(255) DEFAULT NULL,
  "lastChecked" TIMESTAMP DEFAULT NULL,
  "isStale" BOOLEAN DEFAULT FALSE,
  PRIMARY KEY ("id")
);