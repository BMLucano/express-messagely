\echo 'Delete and recreate messagely db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely;
CREATE DATABASE messagely;
\connect messagely


CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);


\echo 'Delete and recreate messagely_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely_test;
CREATE DATABASE messagely_test;
\connect messagely_test

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
  VALUES
  ('b-l', 'password', 'brandie', 'lucano', '768950493', '2004-10-19 10:23:54', '2004-10-19 10:23:54'),
  ('v-k', 'password', 'victor', 'kim', '768950493', '2004-10-19 10:23:54', '2004-10-19 10:23:54')
  ('joelburton', 'password', 'joel', 'burton', '768950493', '2004-10-19 10:23:54', '2004-10-19 10:23:54');

INSERT INTO messages (from_username, to_username, body, sent_at, read_at)
  VALUES
  ('v-k', 'v-k', 'this is a message', '2005-10-19 10:23:54', '2005-10-19 10:25:54'),
  ('b-l', 'b-l', 'this is a message', '2005-10-19 10:23:54', '2005-10-19 10:25:54'),
  ('b-l', 'joelburton', 'this is a message', '2005-10-19 10:23:54', '2005-10-19 10:25:54'),
  ('b-l', 'v-k', 'this is a victor message', '2005-10-19 10:23:54', '2005-10-19 10:25:54'),
  ('v-k', 'joelburton', 'this is a joel message', '2005-10-19 10:23:54', '2005-10-19 10:25:54');