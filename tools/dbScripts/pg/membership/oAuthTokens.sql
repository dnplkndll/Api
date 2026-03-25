DROP TABLE IF EXISTS "oAuthTokens" CASCADE;

CREATE TABLE "oAuthTokens" (
  "id" char(11) NOT NULL,
  "clientId" char(11) DEFAULT NULL,
  "userChurchId" char(11) DEFAULT NULL,
  "accessToken" varchar(1000) DEFAULT NULL,
  "refreshToken" varchar(45) DEFAULT NULL,
  "scopes" varchar(45) DEFAULT NULL,
  "expiresAt" TIMESTAMP DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);
