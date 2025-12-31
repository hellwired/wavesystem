const mysql = require('mysql2/promise');

async function setup() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Admin001',
            database: 'lmsmineduc'
        });

        console.log('Connected to database');

        // Create Roles Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);
        console.log('Roles table checked/created');

        // Insert Default Roles
        await connection.query(`
      INSERT IGNORE INTO roles (name) VALUES ('admin'), ('instructor'), ('student')
    `);
        console.log('Default roles inserted');

        // Create Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);
        console.log('Users table checked/created');

        // Create Courses Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id)
      )
    `);
        console.log('Courses table checked/created');

        // Create Modules Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        title VARCHAR(255) NOT NULL,
        order_index INT,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
        console.log('Modules table checked/created');

        // Create Resources Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module_id INT,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        url TEXT,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      )
    `);
        console.log('Resources table checked/created');

        // Create Enrollments Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        UNIQUE KEY unique_enrollment (user_id, course_id)
      )
    `);
        console.log('Enrollments table checked/created');

        await connection.end();
        console.log('Setup complete');
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

setup();
