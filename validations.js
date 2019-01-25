var joi = require('joi');

module.exports = {
    'apk.upload' : {
        // description: 'some description of the method',
        // notes: ['some notes about the method'],
        // tags: ['tag1', 'tag2'],
        params: joi.any(),
        result: joi.any()
    }
}