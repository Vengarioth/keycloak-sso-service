module.exports = (jwt, audience, issuer, fetchCert) => (token) => new Promise((resolve, reject) => {
    jwt.verify(token, fetchCert, {
        algorithms: ['RS256'],
        audience,
        issuer,
    }, (error, decoded) => {
        if(error) {
            reject(error);
            return;
        }

        resolve(decoded);
    });
});
