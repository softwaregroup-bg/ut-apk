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
                statusId: 'active'
            }
        }
        return this.bus.importMethod($meta.method)(data, $meta)
    }
}