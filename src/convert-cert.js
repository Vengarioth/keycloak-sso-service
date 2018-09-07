module.exports = (getPem) => (kid, modulus, exponent) => ({
    kid,
    cert: getPem(modulus, exponent),
});
