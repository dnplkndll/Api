DROP TABLE IF EXISTS "visitSessions" CASCADE;

CREATE TABLE "visitSessions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "visitId" char(11) DEFAULT NULL,
  "sessionId" char(11) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "visitSessions_id_UNIQUE" UNIQUE ("id")
);

CREATE INDEX IF NOT EXISTS "visitSessions_churchId" ON "visitSessions" ("churchId");
CREATE INDEX IF NOT EXISTS "visitSessions_visitId" ON "visitSessions" ("visitId");
CREATE INDEX IF NOT EXISTS "visitSessions_sessionId" ON "visitSessions" ("sessionId");
