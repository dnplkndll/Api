DROP TABLE IF EXISTS "users" CASCADE;

CREATE TABLE "users" (
  "id" char(11) NOT NULL,
  "email" varchar(191) DEFAULT NULL,
  "password" varchar(255) DEFAULT NULL,
  "authGuid" varchar(255) DEFAULT NULL,
  "displayName" varchar(255) DEFAULT NULL,
  "registrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "lastLogin" TIMESTAMP DEFAULT NULL,
  "firstName" varchar(45) DEFAULT NULL,
  "lastName" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "users_id_UNIQUE" UNIQUE ("id"),
  CONSTRAINT "users_email_UNIQUE" UNIQUE ("email")
);

CREATE INDEX IF NOT EXISTS "users_authGuid_INDEX" ON "users" ("authGuid");
