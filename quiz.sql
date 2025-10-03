CREATE DATABASE quiz;
USE quiz;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Questions (
    questionId INT AUTO_INCREMENT PRIMARY KEY,
    thematique VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswers JSON
);

CREATE TABLE Scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    thematique VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    date_played DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
ALTER TABLE Questions 
MODIFY correctAnswers JSON;