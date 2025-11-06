USE forum;

-- users: two regulars and one moderator
INSERT INTO users (username, password_hash, display_name, role)
VALUES
('Ada Lovelace', '4aef4fe4199a365318cc061e7301cca3aa8b35a7275222d127e8b071dae8718335bf03d51d7385d5dbdc34a5c355d78d95c0c62ed4c2ae4963272757f7ec88cb.ba1a7e4192c8c9d4c55f4cdc1d4ca845', 'Ada Lovelace', 'user'),
('Richard Feynman',   'f9890d3b9a2b8ffe9507e50fb6dbee97dc1a765af4191279c86bc2a039756c36c5f657afe2512d6dd7dc62cfa6414b2149ef252941a3157d8ebd5ae952a63a8e.7cecc379ebcbc62968cd5e62e126f5d3', 'Richard Feynman', 'user'),
('Mod1',  '94235e1fd8da0869e77323e5237f5d3630d45ff73f51cd9f31d71354417d068cbaf82b9422730f3c351265bb8190c8afb7537aea6b0d620bbee86ad5ccd2b171.0f8ed127baafa52fe83f1991e253c110', 'Moderator', 'moderator');

-- posts
INSERT INTO posts (author_id, content, created_at)
VALUES
(1, "Imagination is the discovering faculty, pre-eminently. It is that which penetrates into the unseen worlds around us, the worlds of Science.", CURRENT_TIMESTAMP()),
(2, "I would rather have questions that can't be answered than answers that can't be questioned.", CURRENT_TIMESTAMP());

-- comments
INSERT INTO comments (post_id, author_id, content, created_at)
VALUES
(1, 2, "Hi Ada! Welcome.", CURRENT_TIMESTAMP()),
(1, 3, "Welcome, please remember to read the rules.", CURRENT_TIMESTAMP());

-- likes
INSERT INTO post_likes (post_id, user_id) VALUES (1,2), (2,1);
