var path = require('path');
var fs = require('fs');
var url = require('url'); 
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
                        var dir = path.join(bus.config.workDir, 'uploads','apks');
                        if (!fs.existsSync(dir)){
                                fs.mkdirSync(dir);
                        }
                        var filePath = path.join(dir,fileName);
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
        },{
            method: 'GET',
            path: '/apk/apk-download',
            config: {
                auth:false,
                handler: (request, reply) => {
                    let param = url.parse(request.url).query; 
                    var dir = path.join(bus.config.workDir, 'uploads','apks');
                    var filePath;
                    var files = fs.readdirSync(dir);
                    var apkName = param.apkName;
                    var md5apkName = require('crypto').createHash('md5').update(apkName).digest("hex");
                    var apkFound = false;
                    files.forEach(function (file, index) {
                        var fileName = require('crypto').createHash('md5').update(file).digest("hex");
                        if (fileName == md5apkName) {
                            apkFound = true;
                            filePath = path.join(dir, apkName);
                        }
                    });
                    if (apkFound) {
                        return fs.readFile(filePath, 'utf8', function (err, data) {
                            if (err) throw err;
                            reply(data)
                            .header('Content-Type', 'application/octet-stream')
                            .header('Content-Disposition', `attachment; filename="${apkName}"`)
                            .header('Content-Transfer-Encoding', 'binary');
                        });
                        
                    } else {
                        let obj = { jsonrpc: "2.0", id: "3", error: {} };
                        obj.error = {
                            code: -1,
                            message: "APK not found",
                            errorPrint: "APK not found",
                            type: "DownloadError"
                        }
                        reply(obj);
                    }
                }
            }
        }]);
    }
};
