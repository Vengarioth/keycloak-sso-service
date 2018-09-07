const qs = require('qs');

module.exports = (axios) => ({
    fetchCerts: (realm) => axios.get(
        `realms/${realm}/protocol/openid-connect/certs`
    ),
    obtainToken: (realm, client_id, client_secret, username, password) => axios.post(
        `realms/${realm}/protocol/openid-connect/token`,
        qs.stringify({
            scope: 'openid',
            grant_type: 'password',
            client_id,
            client_secret,
            username,
            password,
        })
    ),
    refreshToken: (realm, client_id, client_secret, refresh_token) => axios.post(
        `realms/${realm}/protocol/openid-connect/token`,
        qs.stringify({
            grant_type: 'refresh_token',
            client_id,
            client_secret,
            refresh_token,
        })
    ),
});
