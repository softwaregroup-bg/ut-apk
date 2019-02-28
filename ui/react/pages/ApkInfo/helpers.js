import { fromJS, Map } from 'immutable';

export function prepareApkToAdd(allData) {
    const data = allData.get('data', new Map());
    const apkId = data.getIn(['apkInfo', 'apkId']);
    const apkName = data.getIn(['apkInfo', 'apkName']);
    const apkSize = data.getIn(['apkInfo', 'apkSize']);
    const apkFileName = data.getIn(['apkInfo', 'apkName']);
    const devices = data.getIn(['apkInfo', 'devices']);
    const imeis = data.getIn(['apkInfo', 'imeis']);
    const androidVersions = data.getIn(['apkInfo', 'androidVersions']);
    const system = data.getIn(['apkInfo', 'system']);
    // TODO: add userTT
    return fromJS({
        apkId,
        apkName,
        apkSize,
        apkFileName,
        devices,
        imeis,
        androidVersions,
        system
    });
}
