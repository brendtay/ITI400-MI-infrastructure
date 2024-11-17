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

// 9. Get an issue by its ID
const getIssueById = async (issueId) => {
    try {
        const query = `
            SELECT ii.*, lt.*, it.issue_name, st.status_name
            FROM infrastructure_issue ii
            LEFT JOIN location lt ON ii.location_id = lt.location_id
            LEFT JOIN issue_types it ON ii.issue_type = it.issue_id
            LEFT JOIN status st ON ii.status_type = st.status_id
            WHERE ii.issue_id = $1;
        `;
        const result = await pool.query(query, [issueId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching issue by ID:', error);
        throw new Error('Failed to fetch issue by ID');
    }
};

// 10. Get issues near a location
const getIssuesNearLocation = async (latitude, longitude, radius) => {
    try {
        const query = `
            SELECT ii.*, lt.*, it.issue_name, st.status_name
            FROM infrastructure_issue ii
            LEFT JOIN location lt ON ii.location_id = lt.location_id
            LEFT JOIN issue_types it ON ii.issue_type = it.issue_id
            LEFT JOIN status st ON ii.status_type = st.status_id
            WHERE lt.gps_coords IS NOT NULL;
        `;
        const result = await pool.query(query);

        // Filter the issues to only include those within the radius
        const issues = result.rows.filter(issue => {
            if (issue.gps_coords) {
                const [lat, lng] = issue.gps_coords.split(',').map(Number);
                const distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lng);
                return distance <= radius;
            }
            return false;
        });

        return issues;
    } catch (error) {
        console.error('Error fetching issues near location:', error);
        throw new Error('Failed to fetch issues near location');
    }
};

// Helper function to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

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