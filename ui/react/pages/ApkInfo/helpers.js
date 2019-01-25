import { fromJS, Map } from 'immutable';

export function prepareApkToAdd(allData) {
    const data = allData.get('data', new Map());
    const apkId = data.getIn(['apkInfo', 'apkId']);
    const apkName = data.getIn(['apkInfo', 'apkName']);
    const apkSize = data.getIn(['apkInfo','apkFile', 'size']);
    const apkPath = data.getIn(['apkInfo','apkFile', 'path']);
    const apkFileName = data.getIn(['apkInfo','apkFile', 'name']);
    const devices = data.getIn(['apkInfo', 'devices']);
    const imeis = data.getIn(['apkInfo', 'imeis']);
    const androidVersions = data.getIn(['apkInfo', 'androidVersions']);
    // TODO: add userTT
    return fromJS({
        apkId,
        apkName,
        apkSize,
        apkPath,
        apkFileName,
        devices,
        imeis,
        androidVersions
    });
}
