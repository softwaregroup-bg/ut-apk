import tabReducers from 'ut-front-react/containers/TabMenu/reducers';
import apkList  from './pages/ApkList/reducers';
import apkInfo  from './pages/ApkInfo/reducers';
export default {
    ...tabReducers,
    ...apkList,
    ...apkInfo
};