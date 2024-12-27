

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."email_signups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "intended_usage" "text",
    "company_name" "text",
    "internal_comment" "text",
    "last_contact" "date"
);


ALTER TABLE "public"."email_signups" OWNER TO "postgres";


COMMENT ON COLUMN "public"."email_signups"."name" IS 'Optional user name';



COMMENT ON COLUMN "public"."email_signups"."intended_usage" IS 'Optional description of how the user intends to use the solution';



CREATE TABLE IF NOT EXISTS "public"."user_manuals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_manuals" OWNER TO "postgres";


ALTER TABLE ONLY "public"."email_signups"
    ADD CONSTRAINT "email_signups_email_unique" UNIQUE ("email");



ALTER TABLE ONLY "public"."email_signups"
    ADD CONSTRAINT "email_signups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_manuals"
    ADD CONSTRAINT "user_manuals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_manuals"
    ADD CONSTRAINT "user_manuals_url_key" UNIQUE ("url");



CREATE INDEX "email_signups_email_idx" ON "public"."email_signups" USING "btree" ("email");



CREATE INDEX "email_signups_intended_usage_idx" ON "public"."email_signups" USING "btree" ("intended_usage");



CREATE INDEX "email_signups_name_idx" ON "public"."email_signups" USING "btree" ("name");



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."user_manuals" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE POLICY "Allow service role inserts" ON "public"."email_signups" FOR INSERT TO "authenticated" WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Prevent unauthorized reads" ON "public"."email_signups" FOR SELECT TO "authenticated" USING (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."email_signups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_manuals" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."email_signups" TO "anon";
GRANT ALL ON TABLE "public"."email_signups" TO "authenticated";
GRANT ALL ON TABLE "public"."email_signups" TO "service_role";



GRANT ALL ON TABLE "public"."user_manuals" TO "anon";
GRANT ALL ON TABLE "public"."user_manuals" TO "authenticated";
GRANT ALL ON TABLE "public"."user_manuals" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
