

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."behaviours" (
    "id" bigint NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."behaviours" OWNER TO "postgres";


ALTER TABLE "public"."behaviours" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."behaviours_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."children" (
    "id" bigint NOT NULL,
    "name" "text",
    "date_of_birth" "date",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."children" OWNER TO "postgres";


ALTER TABLE "public"."children" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."children_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."children_users" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "child_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."children_users" OWNER TO "postgres";


ALTER TABLE "public"."children_users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."children_users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."class_behaviours" (
    "id" bigint NOT NULL,
    "class_id" bigint,
    "behaviour_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_behaviours" OWNER TO "postgres";


ALTER TABLE "public"."class_behaviours" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."class_behaviours_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."class_children" (
    "id" bigint NOT NULL,
    "class_id" bigint,
    "child_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_children" OWNER TO "postgres";


ALTER TABLE "public"."class_children" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."class_children_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."class_users" (
    "id" bigint NOT NULL,
    "class_id" bigint,
    "user_id" bigint,
    "role" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_users" OWNER TO "postgres";


ALTER TABLE "public"."class_users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."class_users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."classes" (
    "id" bigint NOT NULL,
    "class_code" "text",
    "owner_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."classes" OWNER TO "postgres";


ALTER TABLE "public"."classes" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."classes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" bigint NOT NULL,
    "title" "text"
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."notes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notes_id_seq" OWNED BY "public"."notes"."id";



CREATE TABLE IF NOT EXISTS "public"."report_behaviours" (
    "id" bigint NOT NULL,
    "report_id" bigint,
    "behaviour_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."report_behaviours" OWNER TO "postgres";


ALTER TABLE "public"."report_behaviours" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."report_behaviours_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" bigint NOT NULL,
    "class_id" bigint,
    "child_id" bigint,
    "additional_observation" "text",
    "report_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


ALTER TABLE "public"."reports" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "auth_user_id" "uuid",
    "name" "text",
    "role" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."notes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."behaviours"
    ADD CONSTRAINT "behaviours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."children"
    ADD CONSTRAINT "children_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."children_users"
    ADD CONSTRAINT "children_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_behaviours"
    ADD CONSTRAINT "class_behaviours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_children"
    ADD CONSTRAINT "class_children_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_users"
    ADD CONSTRAINT "class_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_class_code_key" UNIQUE ("class_code");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."report_behaviours"
    ADD CONSTRAINT "report_behaviours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."children_users"
    ADD CONSTRAINT "children_users_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."children_users"
    ADD CONSTRAINT "children_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_behaviours"
    ADD CONSTRAINT "class_behaviours_behaviour_id_fkey" FOREIGN KEY ("behaviour_id") REFERENCES "public"."behaviours"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_behaviours"
    ADD CONSTRAINT "class_behaviours_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_children"
    ADD CONSTRAINT "class_children_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_children"
    ADD CONSTRAINT "class_children_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_users"
    ADD CONSTRAINT "class_users_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_users"
    ADD CONSTRAINT "class_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."report_behaviours"
    ADD CONSTRAINT "report_behaviours_behaviour_id_fkey" FOREIGN KEY ("behaviour_id") REFERENCES "public"."behaviours"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."report_behaviours"
    ADD CONSTRAINT "report_behaviours_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."behaviours" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."children" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."children_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_behaviours" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_children" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."report_behaviours" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."behaviours" TO "anon";
GRANT ALL ON TABLE "public"."behaviours" TO "authenticated";
GRANT ALL ON TABLE "public"."behaviours" TO "service_role";



GRANT ALL ON SEQUENCE "public"."behaviours_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."behaviours_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."behaviours_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."children" TO "anon";
GRANT ALL ON TABLE "public"."children" TO "authenticated";
GRANT ALL ON TABLE "public"."children" TO "service_role";



GRANT ALL ON SEQUENCE "public"."children_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."children_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."children_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."children_users" TO "anon";
GRANT ALL ON TABLE "public"."children_users" TO "authenticated";
GRANT ALL ON TABLE "public"."children_users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."children_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."children_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."children_users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."class_behaviours" TO "anon";
GRANT ALL ON TABLE "public"."class_behaviours" TO "authenticated";
GRANT ALL ON TABLE "public"."class_behaviours" TO "service_role";



GRANT ALL ON SEQUENCE "public"."class_behaviours_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_behaviours_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_behaviours_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."class_children" TO "anon";
GRANT ALL ON TABLE "public"."class_children" TO "authenticated";
GRANT ALL ON TABLE "public"."class_children" TO "service_role";



GRANT ALL ON SEQUENCE "public"."class_children_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_children_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_children_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."class_users" TO "anon";
GRANT ALL ON TABLE "public"."class_users" TO "authenticated";
GRANT ALL ON TABLE "public"."class_users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."class_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."class_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."class_users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."classes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."classes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."classes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."report_behaviours" TO "anon";
GRANT ALL ON TABLE "public"."report_behaviours" TO "authenticated";
GRANT ALL ON TABLE "public"."report_behaviours" TO "service_role";



GRANT ALL ON SEQUENCE "public"."report_behaviours_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."report_behaviours_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."report_behaviours_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



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
