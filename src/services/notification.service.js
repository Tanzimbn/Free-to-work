'use strict';

const pool = require('../db/pool');

// Fan-out: create one notification row per user who has this post's category
// in their preferences and has notifications_on = true
async function fanOut(post) {
    const { rows: users } = await pool.query(
        `SELECT ucp.user_id
         FROM user_category_preferences ucp
         JOIN users u ON u.id = ucp.user_id
         WHERE ucp.category_id = $1
           AND u.notifications_on = true
           AND u.id <> $2
           AND u.is_active = true`,
        [post.category_id, post.author_id]
    );

    if (users.length === 0) return;

    const values = users.map((u) => `('${u.user_id}', 'new_post', 'New job in your category', $1, $2)`).join(', ');
    await pool.query(
        `INSERT INTO notifications (user_id, type, title, body, reference_id)
         VALUES ${values}`,
        [post.title, post.id]
    );
}

module.exports = { fanOut };
