
create extension if not exists "uuid-ossp";

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id uuid NOT NULL,
    due_date date NOT NULL,
    completed boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);