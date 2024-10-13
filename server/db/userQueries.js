const pool = require('./index');

// USER QUERIES

// 1. Get all users (admin-only)
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// 2. Get a user by email (for login authentication)
const getUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id 
        WHERE u.email = $1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

// 3. Get a user by ID (for admin or user-specific access)
const getUserById = async (user_id) => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id 
        WHERE u.user_id = $1;
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
};

// 4. Create a new user with default 'User' role
const createUser = async (user) => {
    const { name, email, password_hash } = user;
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'User'))
        RETURNING user_id, name, email;
    `;
    const result = await pool.query(query, [name, email, password_hash]);
    return result.rows[0];
};

// 5. Check if email is already in use
const isEmailTaken = async (email) => {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rowCount > 0;
};

module.exports = {
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUser,
    isEmailTaken,
};