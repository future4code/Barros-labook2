CREATE TABLE IF NOT EXISTS labook_users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS labook_posts (
    id VARCHAR(255) PRIMARY KEY,
    photo VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    type ENUM("normal","event") DEFAULT "normal",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id VARCHAR(255),
    FOREIGN KEY (author_id) REFERENCES labook_users (id)
);

CREATE TABLE IF NOT EXISTS labook_users_friends (
    id VARCHAR(255) PRIMARY KEY,
    user_1_id VARCHAR(255),
    user_2_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_1_id) REFERENCES labook_users (id),
    FOREIGN KEY (user_2_id) REFERENCES labook_users (id)
);

CREATE TABLE IF NOT EXISTS labook_posts_liked (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES labook_posts (id),
    FOREIGN KEY (user_id) REFERENCES labook_users (id)
);