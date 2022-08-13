
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

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
);

CREATE TABLE task_tags(
    id SERIAL PRIMARY KEY,
    task_id int,
    tag_id int,
    CONSTRAINT fk_task_id FOREIGN KEY (task_id) REFERENCES tasks (id),
    CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES tags (id)
);