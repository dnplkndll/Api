DROP FUNCTION IF EXISTS cleanup();

CREATE OR REPLACE FUNCTION cleanup() RETURNS void AS $$
BEGIN
  DELETE FROM conversations WHERE "allowAnonymousPosts" = true AND "dateCreated" < NOW() - INTERVAL '7 days';
  DELETE FROM connections WHERE "timeJoined" < NOW() - INTERVAL '1 day';
  DELETE FROM messages WHERE "conversationId" NOT IN (SELECT id FROM conversations);
END;
$$ LANGUAGE plpgsql;
