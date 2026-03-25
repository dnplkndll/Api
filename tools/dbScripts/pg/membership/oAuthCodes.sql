DROP TABLE IF EXISTS "oAuthCodes" CASCADE;

CREATE TABLE "oAuthCodes" (
  "id" char(11) NOT NULL,
  "userChurchId" char(11) DEFAULT NULL,
  "clientId" char(11) DEFAULT NULL,
  "code" varchar(45) DEFAULT NULL,
  "redirectUri" varchar(255) DEFAULT NULL,
  "scopes" varchar(255) DEFAULT NULL,
  "expiresAt" TIMESTAMP DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);
