-- Type: account_type

-- DROP TYPE IF EXISTS public.account_type;

CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO demo;
-- This SQL code creates a new ENUM type called 'account_type' in the public schema.