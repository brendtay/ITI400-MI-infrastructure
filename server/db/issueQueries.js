const pool = require('./index');

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
const insertIssue = async ({ userId, issueType, statusType, description, locationId, createdTime, updatedTime }) => {
    try {
        const query = `
            INSERT INTO infrastructure_issue (user_id, issue_type, status_type, description, location_id, created_time, updated_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const values = [userId, issueType, statusType, description, locationId, createdTime, updatedTime];
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

// 5. Insert a new location
const insertLocation = async ({ gpsCoords, city, county }) => {
    try {
        const query = `
            INSERT INTO location (gps_coords, city, county)
            VALUES ($1, $2, $3) RETURNING location_id;
        `;
        const values = [gpsCoords, city, county];
        const result = await pool.query(query, values);
        return result.rows[0].location_id;
    } catch (error) {
        console.error('Error inserting location:', error);
        throw new Error('Failed to create location');
    }
};

// 6. Get all issues reported by a specific user
const getIssuesByUser = async (userId) => {
    try {
        const query = `
            SELECT * 
            FROM infrastructure_issue 
            WHERE user_id = $1 
            ORDER BY created_time DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching user issues:', error);
        throw new Error('Failed to fetch user issues');
    }
};

// 7. Get all issues for a specific location
const getIssuesByLocation = async (locationId) => {
    try {
        const query = `
            SELECT * 
            FROM infrastructure_issue 
            WHERE location_id = $1 
            ORDER BY created_time DESC;
        `;
        const result = await pool.query(query, [locationId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching location issues:', error);
        throw new Error('Failed to fetch location issues');
    }
};

// 8. Link an image to an issue
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


module.exports = {
    getAllIssueTypes,
    getAllStatuses,
    insertIssue,
    updateIssueStatus,
    insertLocation,
    getIssuesByUser,
    getIssuesByLocation,
    addImageToIssue
};