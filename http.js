var path = require('path');

module.exports = {
    start: function() {
        this && this.registerRequestHandler && this.registerRequestHandler([{
            method: 'GET',
            path: '/s/apk/{file*}',
            config: {auth: false},
            handler: {
                directory: {
                    path: path.join(__dirname, 'browser'),
                    listing: false,
                    index: false,
                    lookupCompressed: true
                }
            }
        }]);
    }
};
