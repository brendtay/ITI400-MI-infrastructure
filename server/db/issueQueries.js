const { pool } = require('./index');

// ISSUE QUERIES

// 1. Get all issue types
const getAllIssueTypes = async () => {
    try {
        const result = await pool.query('SELECT * FROM issue_types');
        return result.rows;
    } catch (error) {
        console.error('Error fetching issue types:', error);
        throw new Error('Failed to fetch issue types');
    }
};

// 2. Get all status options
const getAllStatuses = async () => {
    try {
        const result = await pool.query('SELECT * FROM status');
        return result.rows;
    } catch (error) {
        console.error('Error fetching statuses:', error);
        throw new Error('Failed to fetch statuses');
    }
};

// 3. Add a new issue (only for logged-in users)
const insertIssue = async ({ userId, issueType, description, locationId, createdTime, updatedTime }) => {
   
    try {
        const query = `
            INSERT INTO infrastructure_issue (user_id, issue_type, description, location_id, created_time, updated_time)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const values = [userId, issueType, description, locationId, createdTime, updatedTime];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting issue:', error);
        throw new Error('Failed to create issue');
    }
};

// 4. Update the status of an issue (admin or MDOT employee only)
const updateIssueStatus = async (issueId, statusType) => {
    try {
        const query = `
            UPDATE infrastructure_issue 
            SET status_type = $1, updated_time = NOW() 
            WHERE issue_id = $2
        `;
        await pool.query(query, [statusType, issueId]);
    } catch (error) {
        console.error('Error updating issue status:', error);
        throw new Error('Failed to update issue status');
    }
};


// 5. Get all issues reported by a specific user
const getIssuesByUser = async (userId) => {
    try {
        const query = `
            SELECT 
                ii.issue_id,
                ii.description,
                ii.created_time,
                ii.updated_time,
                lt.gps_coords,
                lt.city,
                lt.zip,
                it.issue_name,
                st.status_name,
                u.name AS reported_by
            FROM infrastructure_issue ii
            LEFT JOIN location lt ON ii.location_id = lt.location_id
            LEFT JOIN issue_types it ON ii.issue_type = it.issue_id
            LEFT JOIN status st ON ii.status_type = st.status_type
            LEFT JOIN users u ON ii.user_id = u.user_id
            WHERE ii.user_id = $1
            ORDER BY ii.created_time DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching user issues:', error);
        throw new Error('Failed to fetch user issues');
    }
};

// 6. Link an image to an issue
const addImageToIssue = async (imageUrl, issueId, userId) => {
    try {
        const query = `
            INSERT INTO images (image_url, issue_id, uploaded_by)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [imageUrl, issueId, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error linking image to issue:', error);
        throw new Error('Failed to associate image with issue');
    }
};

// 7. Get an issue by its ID
const getIssueById = async (issueId) => {
    try {
        const query = `
            SELECT 
                ii.issue_id,
                ii.description,
                ii.created_time,
                ii.updated_time,
                lt.gps_coords,
                lt.city,
                lt.zip,
                it.issue_name,
                st.status_name,
                u.name AS reported_by
            FROM infrastructure_issue ii
            LEFT JOIN location lt ON ii.location_id = lt.location_id
            LEFT JOIN issue_types it ON ii.issue_type = it.issue_id
            LEFT JOIN status st ON ii.status_type = st.status_type
            LEFT JOIN users u ON ii.user_id = u.user_id
            WHERE ii.issue_id = $1;
        `;
        const result = await pool.query(query, [issueId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching issue by ID:', error);
        throw new Error('Failed to fetch issue by ID');
    }
};


module.exports = {
    getAllIssueTypes,
    getAllStatuses,
    insertIssue,
    updateIssueStatus,
    getIssuesByUser,
    addImageToIssue,
    getIssueById
};