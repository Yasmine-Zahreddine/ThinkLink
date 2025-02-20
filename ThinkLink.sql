-- Table: videos
CREATE TABLE videos (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  description TEXT NULL,
  youtube_url TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  transcript TEXT NULL,
  category ENUM('category_value1', 'category_value2', 'category_value3') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY videos_youtube_url_key (youtube_url)
) ENGINE=InnoDB;

-- Table: users
CREATE TABLE users (
  user_id CHAR(36) NOT NULL DEFAULT (UUID()),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pfp_url TEXT NULL DEFAULT '',
  description TEXT NULL DEFAULT '',
  linkedin_url VARCHAR(255) NULL DEFAULT '',
  github_url VARCHAR(255) NULL DEFAULT '',
  PRIMARY KEY (user_id)
) ENGINE=InnoDB;

-- Indexes for users table
CREATE UNIQUE INDEX users_email_idx ON users (email);
CREATE INDEX users_names_idx ON users (first_name, last_name);
CREATE INDEX users_created_at_idx ON users (created_at);

-- Trigger for updating updated_at column
DELIMITER $$ 
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$ 
DELIMITER ;

-- Table: user_verifications
CREATE TABLE user_verifications (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email TEXT NOT NULL,
  verification_code BIGINT NOT NULL,
  password TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  PRIMARY KEY (id),
  CHECK (expires_at > created_at),
  CHECK (verification_code >= 100000 AND verification_code <= 999999)
) ENGINE=InnoDB;

-- Indexes for user_verifications table
CREATE INDEX user_verifications_email_idx ON user_verifications (email);
CREATE INDEX user_verifications_code_idx ON user_verifications (verification_code);
CREATE INDEX user_verifications_email_code_idx ON user_verifications (email, verification_code);
CREATE INDEX user_verifications_expires_at_idx ON user_verifications (expires_at);

-- Table: chatHistory
CREATE TABLE chatHistory (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userMessage TEXT NOT NULL,
  botResponse TEXT NULL,
  userfk CHAR(36) NULL DEFAULT (UUID()),
  PRIMARY KEY (id),
  FOREIGN KEY (userfk) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;
