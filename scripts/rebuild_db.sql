]
-- Drop the database if it exists
DROP DATABASE IF EXISTS blog_db;

-- Create a new database
CREATE DATABASE blog_db;

-- Connect to the desired database
\c blog_db;

-- Create sequence for post_id
CREATE SEQUENCE post_id_seq;

-- Create sequence for post_postedBy_seq
CREATE SEQUENCE post_postedBy_seq;

-- Create sequence for user_id
CREATE SEQUENCE user_id_seq;

-- Create user table
CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    "firstName" character varying COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    "birthDate" date NOT NULL,
    gender character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    "phoneNumber" character varying COLLATE pg_catalog."default" NOT NULL,
    "registrationDate" date NOT NULL,
    "accountStatus" boolean NOT NULL DEFAULT true,
    role character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

-- Create post table
CREATE TABLE IF NOT EXISTS public.post
(
    id integer NOT NULL DEFAULT nextval('id_seq'::regclass),
    category character varying COLLATE pg_catalog."default",
    title character varying(80) COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    "imageUrl" character varying COLLATE pg_catalog."default",
    date date,
    "postedBy" integer NOT NULL DEFAULT nextval('id_seq'::regclass),
    CONSTRAINT post_pkey PRIMARY KEY (id),
    CONSTRAINT "postedBy" FOREIGN KEY ("postedBy")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Add unique constraint on "id" column in the "user" table
ALTER TABLE public."user"
ADD CONSTRAINT unique_user_id UNIQUE (id);

-- Create some users for tests
INSERT INTO public."user"(
    id, "firstName", "lastName", username, password, email, "birthDate", gender, address, "phoneNumber", "registrationDate", "accountStatus", role)
VALUES (1, 'Tal', 'Matsil', 'Tal', `123`', 'talmatsil@gmail.com', '1993-02-25', 'female', 'Bazelet 61 Street, Rosh Haayin, Israel', '050-8866631', '2024-01-19', true, 'admin');

INSERT INTO public."user"(\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    id, "firstName", "lastName", username, password, email, "birthDate", gender, address, "phoneNumber", "registrationDate", "accountStatus", role)
VALUES (2, 'Tal', 'Matsil', 'TalM', '123', 'tal.matsil@grunitech.com', '1993-02-25', 'female', 'Bazelet 61 Street, Rosh Haayin, Israel', '050-8866631', '2024-01-19', true, 'admin');
