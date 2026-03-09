'use strict';

const config = require('../config');

exports.check_login = (req, res) => {
    if (!req.session.user_id) {
        return res.json({ loggedIn: false });
    }
    const role = (config.admin.email && req.session.user_id === config.admin.email) ? 'admin' : 'user';
    res.json({ loggedIn: true, role });
};
