const { pool } = require('./index');

// USER QUERIES

// 1. Get all users (admin-only)
const getAllUsers = async () => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
};

// 2. Get a user by email (for login authentication)
const getUserByEmail = async (email) => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id 
            WHERE u.email = $1;
        `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user');
    }
};


// 3. Get a user by ID (for admin or user-specific access)
const getUserById = async (user_id) => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id 
            WHERE u.user_id = $1;
        `;
        const result = await pool.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
};

// 4. Create a new user with default 'User' role
const createUser = async (user) => {
    const { name, email, password_hash } = user;
    try {
        const query = `
            INSERT INTO users (name, email, password_hash, role_id)
            VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'User'))
            RETURNING user_id, name, email;
        `;
        const result = await pool.query(query, [name, email, password_hash]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
};

// 5. Check if email is already in use
const isEmailTaken = async (email) => {
    try {
        const query = 'SELECT 1 FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        throw new Error('Failed to check email');
    }
};

// 6. Assign a new role to a user (admin-only)
const assignRoleToUser = async (userId, roleName) => {
    try {
        const query = `
            UPDATE users 
            SET role_id = (SELECT role_id FROM roles WHERE role_name = $1)
            WHERE user_id = $2
            RETURNING user_id, name, email, role_id;
        `;
        const values = [roleName, userId];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('User not found or role assignment failed');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error assigning role to user:', error);
        throw new Error('Failed to assign role');
    }
};

// 7. Get all available roles
const getAllRoles = async () => {
    try {
        const query = 'SELECT * FROM roles';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Failed to fetch roles');
    }
};

// 8. Search for users by name or email (admin-only)
const searchUsers = async (searchTerm) => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id
            WHERE u.name ILIKE $1 OR u.email ILIKE $1;
        `;
        const values = [`%${searchTerm}%`];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
};

// 9. Delete a user by ID (admin-only)
const deleteUserById = async (userId) => {
    try {
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id, name, email';
        const result = await pool.query(query, [userId]);
        if (result.rowCount === 0) {
            throw new Error('User not found or deletion failed');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
};


module.exports = {
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUser,
    isEmailTaken,
    assignRoleToUser,
    getAllRoles,
    searchUsers,
    deleteUserById
};