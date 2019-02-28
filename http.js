var path = require('path');
var fs = require('fs');
var streams = {};
var bus;

module.exports = {
    init: function(b) {
        bus = b;
    },
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
        },{
            method: 'POST',
            path: '/apk/apk-upload',
            config: {
                payload: {
                    maxBytes: 1073741824, // default is 1048576 (1MB), current 1GB
                    output: 'stream',
                    parse: true
                },
                handler: function(request, reply) {
                    //Uploading the file in chunks
                    var file = request.payload.file;
                    var fileName = request.payload.filename;
                    var start = Number(request.payload.start);
                    var end = Number(request.payload.end);
                    var totalSize = Number(request.payload.size);
                    if (file) {
                        var filePath = path.join(bus.config.workDir, 'uploads','apks',fileName);
                        var size = 0;
                        return Promise.resolve()
                        .then(function(){
                            if(fs.existsSync(filePath)){
                                size = fs.statSync(filePath).size;
                                return size;
                            }else{
                                return size;
                            }
                        })
                        .then(function(size){
                                // Basic sanity checks on the chunks
                                if(end == size){
                                    //duplicate chunk
                                    return {
                                        statusCode: 400,
                                        message: 'duplicate chunk'
                                    }
                                }
                                if(start != size){
                                    //missing chunk
                                    return {
                                        statusCode: 400,
                                        message: 'missing chunk'
                                    }
                                }
                                //if everything looks good then read this chunk and append it to the filePath
                                if(start + file._data.length <= totalSize){
                                    fs.writeFileSync(filePath, file._data, {flag: 'a+'});
                                    return {
                                        filename: fileName
                                    }
                                }else{
                                    return {
                                        filename: fileName
                                    }
                                }
                        })
                        .then(function(res){
                            reply(JSON.stringify(res));
                        });
                    } else {
                        // no file
                        reply(JSON.stringify({
                            statusCode: 500,
                            message: 'No apk file provided'
                        }));
                    }
                }
            }
        }]);
    }
};
