import { pool } from '../db';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        // 1. Read and execute the table creation queries directly
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          priority VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          due_date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Database tables created successfully.');

        // 2. Check if the default admin user exists
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@test.com']);

        if (checkUser.rows.length === 0) {
            // 3. Hash the default password and insert
            const hashedPassword = await bcrypt.hash('123456', 10);
            await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
                ['System Admin', 'admin@test.com', hashedPassword]
            );
            console.log('Default admin user seeded successfully.');
        } else {
            console.log('Admin user already exists. Skipping seed.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        pool.end();
    }
};

seedDatabase();