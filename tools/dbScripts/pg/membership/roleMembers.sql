DROP TABLE IF EXISTS "roleMembers" CASCADE;

CREATE TABLE "roleMembers" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "roleId" char(11) DEFAULT NULL,
  "userId" char(11) DEFAULT NULL,
  "dateAdded" TIMESTAMP DEFAULT NULL,
  "addedBy" char(11) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "roleMembers_userId_INDEX" ON "roleMembers" ("userId");
CREATE INDEX IF NOT EXISTS "roleMembers_userId_churchId" ON "roleMembers" ("userId", "churchId");
CREATE INDEX IF NOT EXISTS "roleMembers_roleId_churchId" ON "roleMembers" ("roleId", "churchId");
