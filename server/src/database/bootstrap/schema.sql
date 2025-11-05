-- db/schema.sql
CREATE DATABASE IF NOT EXISTS forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE forum;

-- Create a dedicated application user
CREATE USER IF NOT EXISTS 'forum_user'@'%' IDENTIFIED BY 'forum_password';

-- Grant limited privileges (no DROP DATABASE, etc.)
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, EXECUTE ON forum.* TO 'forum_user'@'%';

-- Ensure privileges are reloaded
FLUSH PRIVILEGES;

-- Turn off foreign key checks so we can drop tables during bootstrapping
SET foreign_key_checks = 0;

-- users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	display_name VARCHAR(150) NOT NULL,
	role ENUM('user','moderator','admin') NOT NULL DEFAULT 'user',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- user session table
DROP TABLE IF EXISTS user_sessions;
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -- BINARY(16) is far more storage-efficient and faster for indexes compared
    -- to CHAR(36)
	session_id BINARY(16) NOT NULL,
	user_id BIGINT UNSIGNED NOT NULL,
	login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	logout_time TIMESTAMP NULL,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	ip_address VARCHAR(45),
	user_agent VARCHAR(255),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	INDEX (user_id),
	INDEX (is_active)
) ENGINE=InnoDB;

-- posts
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	author_id BIGINT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	flagged TINYINT(1) NOT NULL DEFAULT 0,
	flagged_by BIGINT UNSIGNED NULL,
	flagged_at TIMESTAMP NULL,
	FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (flagged_by) REFERENCES users(id) ON DELETE SET NULL,
	INDEX (created_at),
	INDEX (author_id)
) ENGINE=InnoDB;

-- comments
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	post_id BIGINT UNSIGNED NOT NULL,
	author_id BIGINT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
	INDEX (post_id),
	INDEX (author_id)
) ENGINE=InnoDB;

-- likes; unique constraint ensures one like per user per post
DROP TABLE IF EXISTS post_likes;
CREATE TABLE post_likes (
		id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
		post_id BIGINT UNSIGNED NOT NULL,
		user_id BIGINT UNSIGNED NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		UNIQUE KEY uq_post_user (post_id, user_id),
		INDEX (user_id)
) ENGINE=InnoDB;

-- simple audit: moderator flags history (optional)
DROP TABLE IF EXISTS post_flags;
CREATE TABLE post_flags (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	post_id BIGINT UNSIGNED NOT NULL,
	flagged_by BIGINT UNSIGNED NOT NULL,
	reason VARCHAR(255),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY (flagged_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

/* STORED PROCEDURES */
/* USERS */
DROP PROCEDURE IF EXISTS `sp_users_read`;
DELIMITER //
CREATE PROCEDURE `sp_users_read`(
    IN p_user_id BIGINT UNSIGNED,
    IN p_username VARCHAR(100)
)
BEGIN
    SELECT JSON_OBJECT(
        'id', u.id,
        'username', u.username,
        'passwordHash', u.password_hash
    ) AS json_result
    FROM users u
    WHERE (p_user_id IS NOT NULL AND u.id = p_user_id)
       OR (p_username IS NOT NULL AND u.username = p_username)
    LIMIT 1;
END//
DELIMITER ;

/* USERS_READ_MANY */
DROP PROCEDURE IF EXISTS `sp_users_read_all`;
DELIMITER //
CREATE PROCEDURE `sp_users_read_all`()
BEGIN
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', u.id,
            'username', u.username,
            'passwordHash', u.password_hash
        )
    ) AS json_result
    FROM users u;
END//
DELIMITER ;

/* USERS_CREATE */
DROP PROCEDURE IF EXISTS `sp_users_create`;
DELIMITER //
CREATE PROCEDURE `sp_users_create`(
    IN p_username VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_user_id BIGINT;

    INSERT INTO users (username, password_hash, display_name)
    VALUES (p_username, p_password_hash, p_username);

    SET v_user_id = LAST_INSERT_ID();

    SELECT JSON_OBJECT(
        'id', u.id,
        'username', u.username,
        'passwordHash', u.password_hash,
        'role', u.role
    ) AS json_result
    FROM users u
    WHERE u.id = v_user_id
    LIMIT 1;
END//
DELIMITER ;

/* AUTH_LOGIN */
DROP PROCEDURE IF EXISTS `sp_auth_login`;
DELIMITER //
CREATE PROCEDURE `sp_auth_login`(
    IN p_username VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
sp:BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_role ENUM('user','moderator','admin');
    DECLARE v_password_hash VARCHAR(255);
    DECLARE v_session_id BINARY(16);

    -- Check credentials
    SELECT id, password_hash, role
    INTO v_user_id, v_password_hash, v_role
    FROM users
    WHERE (username = p_username
        AND password_hash = p_password_hash)
    LIMIT 1;

    IF (v_user_id IS NULL) THEN
        SELECT JSON_OBJECT('error', 'Invalid username or password') AS json_result;
        LEAVE sp;
    END IF;

    IF (v_password_hash IS NULL) THEN
        SELECT JSON_OBJECT('error', 'Invalid username or password') AS json_result;
        LEAVE sp;
    END IF;

    -- Generate binary UUID
    SET v_session_id = UUID_TO_BIN(UUID());

    -- Store session
    INSERT INTO user_sessions(user_id, session_id, login_time)
    VALUES (v_user_id, v_session_id, NOW());

    -- Return JSON with UUID as string
    SELECT JSON_OBJECT(
        'userId', v_user_id,
        'username', p_username,
        'role', v_role,
        'sessionId', BIN_TO_UUID(v_session_id)
    ) AS json_result;
END//
DELIMITER ;

/* LOGOUT */
DROP PROCEDURE IF EXISTS `sp_auth_logout`;
DELIMITER //
CREATE PROCEDURE `sp_auth_logout`(
    IN p_session_id CHAR(36)
)
BEGIN
    UPDATE user_sessions
    SET is_active = FALSE, logout_time = NOW()
    WHERE session_id = UUID_TO_BIN(p_session_id);

    SELECT JSON_OBJECT('success', ROW_COUNT() > 0) AS json_result;
END//
DELIMITER ;

/* VALIDATE SESSION */
DROP PROCEDURE IF EXISTS `sp_session_validate_session`;
DELIMITER //
CREATE PROCEDURE `sp_session_validate_session`(
    IN p_session_id CHAR(36)
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_role ENUM('user','moderator','admin');
    DECLARE v_session_id BINARY(16);

    SELECT u.id, u.role, s.session_id
    INTO v_user_id, v_role, v_session_id
    FROM users u
    JOIN user_sessions s 
        ON u.id = s.user_id
    WHERE (
            (s.session_id = UUID_TO_BIN(p_session_id))
        AND 
            (s.is_active = TRUE)
    )
    LIMIT 1;

    IF (v_user_id IS NULL) THEN
        SELECT JSON_OBJECT('valid', FALSE) AS json_result;
    ELSE
        SELECT JSON_OBJECT(
            'valid', TRUE, 
            'userId', v_user_id, 
            'role', v_role,
            'sessionId', BIN_TO_UUID(v_session_id)
        ) AS json_result;
    END IF;
END//
DELIMITER ;

/* POSTS_CREATE */
DROP PROCEDURE IF EXISTS `sp_posts_create`;
DELIMITER //
CREATE PROCEDURE `sp_posts_create`(IN p_author_id BIGINT, IN p_content TEXT)
BEGIN
	INSERT INTO posts (author_id, content) VALUES (p_author_id, p_content);
	SELECT JSON_OBJECT(
		'postId', LAST_INSERT_ID()
	) AS result;
END//
DELIMITER ;

/* POSTS_READ_MANY */
DROP PROCEDURE IF EXISTS `sp_posts_read_many`;
DELIMITER //
CREATE PROCEDURE `sp_posts_read_many`(IN p_offset INT, IN p_limit INT)
BEGIN
	SELECT JSON_ARRAYAGG(json_object) as json_result
    FROM (
        SELECT JSON_OBJECT(
            'id', p.id,
            'content', p.content,
            'createdAt', p.created_at,
            'flagged', p.flagged,
            'author', JSON_OBJECT(
                'id', u.id,
                'displayName', u.display_name,
                'role', u.role
            ),
            'likes', (
                COALESCE((SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 0)
            ),
            'commentsCount', (
                COALESCE((SELECT COUNT(*) FROM comments WHERE post_id = p.id), 0)
            ),
            'comments', (
                SELECT IFNULL(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', c.id,
                            'content', c.content,
                            'createdAt', c.created_at,
                            'author', JSON_OBJECT(
                                'id', cu.id,
                                'displayName', cu.display_name
                            )
                        )
                    ),
                    JSON_ARRAY()
                )
                FROM comments c
                JOIN users cu 
                    ON cu.id = c.author_id
                WHERE c.post_id = p.id
                ORDER BY c.created_at ASC
            )
        ) as json_object
        FROM posts p
        JOIN users u
        ON u.id = p.author_id
        ORDEr BY p.created_at DESC
        LIMIT p_limit OFFSET p_offset
    ) as t;
END//
DELIMITER ;

/* COMMENTS_READ_MANY */
DROP PROCEDURE IF EXISTS `sp_comments_read_many`;
DELIMITER //
CREATE PROCEDURE `sp_comments_read_many`(IN p_post_id INT)
BEGIN
    SELECT JSON_ARRAYAGG(json_object) as json_result
    FROM ( 
        SELECT JSON_OBJECT(
            'id', c.id,
            'content', c.content,
            'createdAt', c.created_at,
            'author', JSON_OBJECT(
                'id', cu.id,
                'displayName', cu.display_name
            )
        ) as json_object
        FROM comments c
        JOIN users cu 
            ON cu.id = c.author_id
        WHERE c.post_id = p_post_id
        ORDER BY c.created_at ASC
    ) as t;
END//
DELIMITER ;

/* CREATE COMMENT */
DROP PROCEDURE IF EXISTS `sp_comments_create`;
DELIMITER //
CREATE PROCEDURE `sp_comments_create`(
    IN p_post_id BIGINT UNSIGNED,
    IN p_author_id BIGINT UNSIGNED,
    IN p_content TEXT
)
proc:BEGIN
    DECLARE v_comment_id BIGINT;

    -- Validate that the post exists
    IF (SELECT COUNT(*) FROM posts WHERE id = p_post_id) = 0 THEN
        SELECT JSON_OBJECT('status', 'ERROR', 'message', 'Post does not exist') AS json_result;
        LEAVE proc;
    END IF;

    -- Insert the new comment
    INSERT INTO comments (post_id, author_id, content)
    VALUES (p_post_id, p_author_id, p_content);

    SET v_comment_id = LAST_INSERT_ID();

    -- Return the created comment with author info
    SELECT JSON_OBJECT(
        'id', c.id,
        'postId', c.post_id,
        'content', c.content,
        'createdAt', c.created_at,
        'author', JSON_OBJECT(
            'id', u.id,
            'username', u.username,
            'displayName', u.display_name
        )
    ) AS json_result
    FROM comments c
    JOIN users u ON u.id = c.author_id
    WHERE c.id = v_comment_id
    LIMIT 1;
END//
DELIMITER ;

/* TOGGLE LIKE */
DROP PROCEDURE IF EXISTS `sp_posts_toggle_like`;
DELIMITER //
CREATE PROCEDURE `sp_posts_toggle_like`(
    IN p_post_id BIGINT, 
    IN p_user_id BIGINT
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO v_exists FROM post_likes pl WHERE pl.post_id = p_post_id AND pl.user_id = p_user_id;

    IF v_exists > 0 THEN
        DELETE FROM post_likes pl WHERE pl.post_id = p_post_id AND user_id = p_user_id;
    ELSE
        INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, p_user_id);
    END IF;

    SELECT JSON_OBJECT(
        'likes', COALESCE((SELECT COUNT(*) FROM post_likes pl WHERE p_post_id = pl.post_id), 0)
    ) as json_result;
END//
DELIMITER ;

/* FLAG */
DROP PROCEDURE IF EXISTS `sp_posts_toggle_flag`;
DELIMITER //
CREATE PROCEDURE `sp_posts_toggle_flag`(
    IN p_post_id BIGINT UNSIGNED,
    IN p_flagged_by BIGINT UNSIGNED,
    IN p_reason VARCHAR(255)
)
proc:BEGIN
    DECLARE v_is_flagged TINYINT(1);

    -- Get current flag status
    SELECT flagged INTO v_is_flagged
    FROM posts p
    WHERE p.id = p_post_id
    LIMIT 1;

    IF (v_is_flagged IS NULL) THEN
        SELECT JSON_OBJECT('status', 'ERROR', 'message', 'Post not found') AS json_result;
        LEAVE proc;
    END IF;

    IF (v_is_flagged = 0) THEN
        -- Flag the post
        UPDATE posts p
        SET p.flagged = 1,
            p.flagged_by = p_flagged_by,
            p.flagged_at = NOW()
        WHERE id = p_post_id;

        INSERT INTO post_flags (post_id, flagged_by, reason)
        VALUES (p_post_id, p_flagged_by, p_reason);
    ELSE
        -- Unflag the post
        UPDATE posts
        SET flagged = 0,
            flagged_by = NULL,
            flagged_at = NULL
        WHERE id = p_post_id;
    END IF;
    SELECT JSON_OBJECT('flagged', p.flagged) AS json_result FROM posts p WHERE p.id = p_post_id;
END//
DELIMITER ;

/* READ STATS */
DROP PROCEDURE IF EXISTS `sp_posts_read_stats`;
DELIMITER //
CREATE PROCEDURE `sp_posts_read_stats`(
    IN p_post_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_likes_count INT DEFAULT 0;
    DECLARE v_comments_count INT DEFAULT 0;
    DECLARE v_is_flagged BOOLEAN DEFAULT FALSE;

    -- Count likes
    SELECT COUNT(*) INTO v_likes_count
    FROM post_likes
    WHERE post_id = p_post_id;

    -- Count comments
    SELECT COUNT(*) INTO v_comments_count
    FROM comments
    WHERE post_id = p_post_id;

    -- Check if flagged
    SELECT flagged INTO v_is_flagged
    FROM posts
    WHERE id = p_post_id
    LIMIT 1;

    -- Return JSON
    SELECT JSON_OBJECT(
        'postId', p_post_id,
        'likes', v_likes_count,
        'comments', v_comments_count,
        'flagged', v_is_flagged
    ) AS json_result;
END//
DELIMITER ;

SET foreign_key_checks = 1;
