DROP TABLE IF EXISTS "gateways" CASCADE;

CREATE TABLE "gateways" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "provider" varchar(50) DEFAULT NULL,
  "publicKey" varchar(255) DEFAULT NULL,
  "privateKey" varchar(255) DEFAULT NULL,
  "webhookKey" varchar(255) DEFAULT NULL,
  "productId" varchar(255) DEFAULT NULL,
  "payFees" BOOLEAN DEFAULT NULL,
  "currency" varchar(10) DEFAULT NULL,
  "settings" json DEFAULT NULL,
  "environment" varchar(50) DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "gateways_id_UNIQUE" UNIQUE ("id")
);
