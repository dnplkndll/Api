DROP FUNCTION IF EXISTS "updateConversationStats"(char);

CREATE OR REPLACE FUNCTION "updateConversationStats"("convId" char(11)) RETURNS void AS $$
BEGIN
  UPDATE conversations SET
    "postCount" = (SELECT COUNT(*) FROM messages WHERE "churchId" = conversations."churchId" AND "conversationId" = conversations.id),
    "firstPostId" = (SELECT id FROM messages WHERE "churchId" = conversations."churchId" AND "conversationId" = conversations.id ORDER BY "timeSent" LIMIT 1),
    "lastPostId" = (SELECT id FROM messages WHERE "churchId" = conversations."churchId" AND "conversationId" = conversations.id ORDER BY "timeSent" DESC LIMIT 1)
  WHERE id = "convId";
END;
$$ LANGUAGE plpgsql;
