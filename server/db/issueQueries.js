const pool = require('./index');

// ISSUE QUERIES

// 1. Get all issue types
const getAllIssueTypes = async () => {
    const result = await pool.query('SELECT * FROM issue_types');
    return result.rows;
};

// 2. Get all status options
const getAllStatuses = async () => {
    const result = await pool.query('SELECT * FROM status');
    return result.rows;
};

// 3. Add a new issue (only for logged-in users)
const addNewIssue = async (issue) => {
    const { user_id, description, issue_type, status_type, location_id } = issue;
    const query = `
        INSERT INTO infrastructure_issue 
        (user_id, description, issue_type, status_type, location_id) 
        VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [user_id, description, issue_type, status_type, location_id]);
};

// 4. Update the status of an issue (admin or MDOT employee only)
const updateIssueStatus = async (issue_id, status_type) => {
    const query = `
        UPDATE infrastructure_issue 
        SET status_type = $1, updated_time = NOW() 
        WHERE issue_id = $2
    `;
    await pool.query(query, [status_type, issue_id]);
};

module.exports = {
    getAllIssueTypes,
    getAllStatuses,
    addNewIssue,
    updateIssueStatus
};