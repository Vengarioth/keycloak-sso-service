module.exports = (fetchCerts, convertCert, realm) => {
    let certs = [];
    return (kid) => {
        const key = certs.find(key => key.kid === kid);
        if(key) {
            return Promise.resolve(key.cert);
        }

        return fetchCerts(realm)
        .then(result => {
            const { keys } = result.data;
            certs = keys.map(key => convertCert(key.kid, key.n, key.e));
            
            const key = certs.find(key => key.kid === kid);
            if(key) {
                return Promise.resolve(key.cert);
            } else {
                return Promise.reject(`Unknown kid ${kid}`);
            }
        });
    };
}
