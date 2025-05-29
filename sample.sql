CREATE DATABASE book_db;
USE book_db;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INT NOT NULL,
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (uuid, title, author, published_year, genre) VALUES
(UUID(), 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic'),
(UUID(), 'To Kill a Mockingbird', 'Harper Lee', 1960, 'Fiction'),
(UUID(), '1984', 'George Orwell', 1949, 'Dystopian'),
(UUID(), 'Pride and Prejudice', 'Jane Austen', 1813, 'Romance'),
(UUID(), 'Moby-Dick', 'Herman Melville', 1851, 'Adventure'),
(UUID(), 'War and Peace', 'Leo Tolstoy', 1869, 'Historical'),
(UUID(), 'Ulysses', 'James Joyce', 1922, 'Modernist'),
(UUID(), 'The Catcher in the Rye', 'J.D. Salinger', 1951, 'Fiction'),
(UUID(), 'The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy'),
(UUID(), 'Fahrenheit 451', 'Ray Bradbury', 1953, 'Dystopian'),
(UUID(), 'Brave New World', 'Aldous Huxley', 1932, 'Dystopian'),
(UUID(), 'Crime and Punishment', 'Fyodor Dostoevsky', 1866, 'Psychological'),
(UUID(), 'Jane Eyre', 'Charlotte Brontë', 1847, 'Gothic'),
(UUID(), 'The Odyssey', 'Homer', -700, 'Epic'),
(UUID(), 'Les Misérables', 'Victor Hugo', 1862, 'Historical'),
(UUID(), 'The Divine Comedy', 'Dante Alighieri', 1320, 'Epic'),
(UUID(), 'Hamlet', 'William Shakespeare', 1603, 'Tragedy'),
(UUID(), 'The Brothers Karamazov', 'Fyodor Dostoevsky', 1880, 'Philosophical'),
(UUID(), 'Anna Karenina', 'Leo Tolstoy', 1878, 'Drama'),
(UUID(), 'The Grapes of Wrath', 'John Steinbeck', 1939, 'Historical'),
(UUID(), 'Dracula', 'Bram Stoker', 1897, 'Gothic Horror'),
(UUID(), 'Wuthering Heights', 'Emily Brontë', 1847, 'Gothic'),
(UUID(), 'A Tale of Two Cities', 'Charles Dickens', 1859, 'Historical'),
(UUID(), 'Don Quixote', 'Miguel de Cervantes', 1605, 'Satire'),
(UUID(), 'The Count of Monte Cristo', 'Alexandre Dumas', 1844, 'Adventure'),
(UUID(), 'Frankenstein', 'Mary Shelley', 1818, 'Horror'),
(UUID(), 'The Iliad', 'Homer', -750, 'Epic'),
(UUID(), 'Madame Bovary', 'Gustave Flaubert', 1856, 'Realism'),
(UUID(), 'The Sun Also Rises', 'Ernest Hemingway', 1926, 'Modernist'),
(UUID(), 'Slaughterhouse-Five', 'Kurt Vonnegut', 1969, 'Sci-Fi');
