DROP TABLE IF EXISTS "people" CASCADE;

CREATE TABLE "people" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "userId" char(11) DEFAULT NULL,
  "displayName" varchar(100) DEFAULT NULL,
  "firstName" varchar(50) DEFAULT NULL,
  "middleName" varchar(50) DEFAULT NULL,
  "lastName" varchar(50) DEFAULT NULL,
  "nickName" varchar(50) DEFAULT NULL,
  "prefix" varchar(10) DEFAULT NULL,
  "suffix" varchar(10) DEFAULT NULL,
  "birthDate" TIMESTAMP DEFAULT NULL,
  "gender" varchar(11) DEFAULT NULL,
  "maritalStatus" varchar(10) DEFAULT NULL,
  "anniversary" TIMESTAMP DEFAULT NULL,
  "membershipStatus" varchar(50) DEFAULT NULL,
  "homePhone" varchar(21) DEFAULT NULL,
  "mobilePhone" varchar(21) DEFAULT NULL,
  "workPhone" varchar(21) DEFAULT NULL,
  "email" varchar(100) DEFAULT NULL,
  "address1" varchar(50) DEFAULT NULL,
  "address2" varchar(50) DEFAULT NULL,
  "city" varchar(30) DEFAULT NULL,
  "state" varchar(10) DEFAULT NULL,
  "zip" varchar(10) DEFAULT NULL,
  "photoUpdated" TIMESTAMP DEFAULT NULL,
  "householdId" char(11) DEFAULT NULL,
  "householdRole" varchar(10) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  "conversationId" char(11) DEFAULT NULL,
  "optedOut" BOOLEAN DEFAULT NULL,
  "nametagNotes" varchar(20) DEFAULT NULL,
  "donorNumber" varchar(20) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "people_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "people_churchId" ON "people" ("churchId");
CREATE INDEX IF NOT EXISTS "people_userId" ON "people" ("userId");
CREATE INDEX IF NOT EXISTS "people_householdId" ON "people" ("householdId");
CREATE INDEX IF NOT EXISTS "people_id_INDEX" ON "people" ("id");
