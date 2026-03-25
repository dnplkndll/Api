DROP TABLE IF EXISTS "groupMembers" CASCADE;

CREATE TABLE "groupMembers" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "joinDate" TIMESTAMP DEFAULT NULL,
  "leader" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "groupMembers_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "groupMembers_churchId" ON "groupMembers" ("churchId");
CREATE INDEX IF NOT EXISTS "groupMembers_groupId" ON "groupMembers" ("groupId");
CREATE INDEX IF NOT EXISTS "groupMembers_personId" ON "groupMembers" ("personId");
CREATE INDEX IF NOT EXISTS "groupMembers_churchId_groupId_personId" ON "groupMembers" ("churchId", "groupId", "personId");
CREATE INDEX IF NOT EXISTS "groupMembers_personId_churchId" ON "groupMembers" ("personId", "churchId");
