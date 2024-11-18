const { pool } = require('./index');

// Insert a new location or reuse an existing one
const findOrCreateLocation = async ({ gpsCoords, city, zip }) => {
    try {
        // Check if the location already exists
        const findQuery = `
            SELECT location_id FROM location
            WHERE gps_coords = $1 AND city = $2 AND zip = $3
        `;
        const findResult = await pool.query(findQuery, [gpsCoords, city, zip]);

        if (findResult.rows.length > 0) {
            return findResult.rows[0].location_id; // Reuse existing location
        }

        // Insert a new location if it doesn't exist
        const insertQuery = `
            INSERT INTO location (gps_coords, city, zip)
            VALUES ($1, $2, $3)
            RETURNING location_id
        `;
        const insertResult = await pool.query(insertQuery, [gpsCoords, city, zip]);
        return insertResult.rows[0].location_id;
    } catch (error) {
        console.error('Error finding or creating location:', error);
        throw new Error('Failed to find or create location');
    }
};

// Get all issues for a specific zip code
const getIssuesByZipCode = async (zip) => {
    try {
        const query = `
            SELECT ii.*, lt.*, it.issue_name, st.status_name
            FROM infrastructure_issue ii
            LEFT JOIN location lt ON ii.location_id = lt.location_id
            LEFT JOIN issue_types it ON ii.issue_type = it.issue_id
            LEFT JOIN status st ON ii.status_type = st.status_id
            WHERE lt.zip = $1
            ORDER BY ii.created_time DESC;
        `;
        const result = await pool.query(query, [zip]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching issues by zip code:', error);
        throw new Error('Failed to fetch issues by zip code');
    }
};

// Get issues near a location
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
        return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

module.exports = {
    findOrCreateLocation,
    getIssuesByZipCode,
    getIssuesNearLocation,
};