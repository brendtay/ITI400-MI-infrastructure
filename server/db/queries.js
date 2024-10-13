// Import the pool from the index.js file
const pool = require('./index');

//ISSUE QUERIES

// 1. Get all users
const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// 2. Get all issue types
const getAllIssueTypes = async () => {
    const result = await pool.query('SELECT * FROM issue_types');
    return result.rows;
};

// 3. Get all status options
const getAllStatuses = async () => {
    const result = await pool.query('SELECT * FROM status');
    return result.rows;
};

// 4. Add a new issue
const addNewIssue = async (issue) => {
    const { issue_id, user_id, description, issue_type, status_type, location_id } = issue;
    const query = `
        INSERT INTO infrastructure_issue 
        (issue_id, user_id, description, issue_type, status_type, location_id) 
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [issue_id, user_id, description, issue_type, status_type, location_id]);
};

// 5. Update the status of an issue
const updateIssueStatus = async (issue_id, status_type) => {
    const query = `
        UPDATE infrastructure_issue 
        SET status_type = $1, updated_time = NOW() 
        WHERE issue_id = $2
    `;
    await pool.query(query, [status_type, issue_id]);
};

//USER QUERIES

// 1. Get all users
const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// 2. Get a user by email (used for login authentication)
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

// 3. Get a user by ID
const getUserById = async (user_id) => {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
};

// 4. Create a new user (account creation)
const createUser = async (user) => {
    const { name, email, password_hash, role } = user;
    const query = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, email, role;
    `;
    const result = await pool.query(query, [name, email, password_hash, role]);
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
    getAllIssueTypes,
    getAllStatuses,
    addNewIssue,
    updateIssueStatus
};