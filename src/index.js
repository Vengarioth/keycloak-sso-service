const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const getPem = require('rsa-pem-from-mod-exp');

const createKeycloakApi = require('./api/keycloak');
const createVerifyJwt = require('./verify-jwt');
const createConvertCert = require('./convert-cert');
const createFetchCert = require('./fetch-cert');

const port = process.env.PORT || 8000;
const authServerUrl = process.env.AUTH_SERVER_URL || 'http://localhost:8080/auth';
const authServerClientId = process.env.AUTH_SERVER_CLIENT_ID || 'test-client';
const authServerClientSecret = process.env.AUTH_SERVER_CLIENT_SECRET || 'a5cb511c-3144-448f-9fb7-c95b317ed4fb';
const authServerRealm = process.env.AUTH_SERVER_REALM || 'users';

const instance = axios.create({
    baseURL: authServerUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

const keycloakApi = createKeycloakApi(instance);
const convertCert = createConvertCert(getPem);
const fetchCert = createFetchCert(keycloakApi.fetchCerts, convertCert, authServerRealm);
const verifyJwt = createVerifyJwt(jwt, authServerClientId, `${authServerUrl}/realms/${authServerRealm}`, (header, callback) => {
    fetchCert(header.kid)
    .then(cert => callback(null, cert))
    .catch(error => callback(error));
});

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    keycloakApi.obtainToken(authServerRealm, authServerClientId, authServerClientSecret, username, password)
    .then(result => {
        const { id_token, access_token, refresh_token } = result.data;

        res.send({
            id_token,
            access_token,
            refresh_token,
        });
    })
    .catch(error => res.status(401) && res.send({ error: 'invalid username or password' }) && console.error(error));
});

app.post('/refresh', (req, res) => {
    const { refresh_token } = req.body;
    verifyJwt(refresh_token)
    .then(decoded => {
        keycloakApi.refreshToken(authServerRealm, authServerClientId, authServerClientSecret, refresh_token)
        .then(result => {
            const { id_token, access_token, refresh_token } = result.data;

            res.send({
                id_token,
                access_token,
                refresh_token,
            });
        })
        .catch(error => res.status(401) && res.send({ error: 'invalid refresh token' }) && console.error(error));
    })
    .catch(error => res.status(401) && res.send({ error: 'invalid refresh token' }) && console.error(error));
});

app.listen(port, () => {
    console.log(`service listening on port ${port}`);
});
