module.exports = () => ({
    ports: [],
    modules: {
        apk: require('./api/script'),
        'db/apk': require('./api/sql'),
        apkHTTP: require('./http')
    },
    validations: {
        apk: require('./validations')
    },
    errors: require('./errors')
});
