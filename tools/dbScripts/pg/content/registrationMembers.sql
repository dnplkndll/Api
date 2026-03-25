DROP TABLE IF EXISTS "registrationMembers" CASCADE;
CREATE TABLE "registrationMembers" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "registrationId" char(11) NOT NULL,
  "personId" char(11) DEFAULT NULL,
  "firstName" varchar(100) DEFAULT NULL,
  "lastName" varchar(100) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "registrationMembers_ix_regMembers_registrationId" ON "registrationMembers" ("registrationId");
CREATE INDEX IF NOT EXISTS "registrationMembers_ix_regMembers_personId" ON "registrationMembers" ("personId");
