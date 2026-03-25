DROP TABLE IF EXISTS "userChurches" CASCADE;

CREATE TABLE "userChurches" (
  "id" char(11) NOT NULL,
  "userId" char(11) DEFAULT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "lastAccessed" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "userChurches_userId" ON "userChurches" ("userId");
CREATE INDEX IF NOT EXISTS "userChurches_churchId" ON "userChurches" ("churchId");
