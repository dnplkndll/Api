DROP TABLE IF EXISTS "churches" CASCADE;

CREATE TABLE "churches" (
  "id" char(11) NOT NULL,
  "name" varchar(255) DEFAULT NULL,
  "subDomain" varchar(45) DEFAULT NULL,
  "registrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "address1" varchar(255) DEFAULT NULL,
  "address2" varchar(255) DEFAULT NULL,
  "city" varchar(255) DEFAULT NULL,
  "state" varchar(45) DEFAULT NULL,
  "zip" varchar(45) DEFAULT NULL,
  "country" varchar(45) DEFAULT NULL,
  "archivedDate" TIMESTAMP DEFAULT NULL,
  "latitude" REAL DEFAULT NULL,
  "longitude" REAL DEFAULT NULL,
  PRIMARY KEY ("id")
);
