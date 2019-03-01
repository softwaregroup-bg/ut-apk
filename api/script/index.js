module.exports = {
    'apk.add': function(msg,$meta){
        $meta.method = 'db/apk.apk.add';
        var data = {
            apk:{
                apkName: msg.apkName,
                devices: msg.devices,
                imeis: msg.imeis,
                androidVersions: msg.androidVersions,
                apkFileName: msg.apkName,
                apkSize: msg.apkSize,
                systemId: msg.system,
                statusId: 'new'
            }
        }
        return this.bus.importMethod($meta.method)(data, $meta);
    },
    'apk.fetch': function(msg,$meta){
        let url = this.bus.config.apk.url;
        let uri = this.bus.config.apk.uri;
        $meta.method = 'db/apk.apk.fetch';
        return this.bus.importMethod($meta.method)(msg,$meta)
        .then((results)=>{
            results.apk = Array.isArray(results.apk) ? results.apk : []
            results.apk = results.apk.map((curr)=>{
                curr.link = `${url}/${uri}/${curr.apkName}`;
                return curr;
            });
            return results;
        });
    },
    'apk.get': function(msg,$meta){
        $meta.method = 'db/apk.apk.get';
        return this.bus.importMethod($meta.method)(msg,$meta)
    },
    'apk.edit': function(msg,$meta){
        $meta.method = 'db/apk.apk.edit';
        var data = {
            apk:{
                apkId: msg.apkId,
                apkName: msg.apkName,
                devices: msg.devices,
                imeis: msg.imeis,
                androidVersions: msg.androidVersions,
                apkFileName: msg.apkName,
                apkSize: msg.apkSize,
                systemId: msg.system,
                statusId: 'pending'
            }
        }
        return this.bus.importMethod($meta.method)(data, $meta);
    },
    'apk.delete': function(msg,$meta){
        $meta.method = 'db/apk.apk.delete';
        return this.bus.importMethod($meta.method)(msg,$meta);
    },
    'suspendStatus.edit': function(msg,$meta){
        $meta.method = 'db/apk.suspendStatus.edit';
        return this.bus.importMethod($meta.method)({apkId:msg.apkId,statusId:msg.status},$meta);
    },
    'apk.approve': function(msg,$meta){
        $meta.method = 'db/apk.apk.approve';
        return this.bus.importMethod($meta.method)(msg,$meta);
    }
}