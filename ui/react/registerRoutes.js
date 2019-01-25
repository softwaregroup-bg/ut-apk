import { registerRoute } from 'ut-front/react/routerHelper';

export default () => {
    let mainRoute = 'ut-apk:home';
    registerRoute(mainRoute).path('/apk');
    // Apks
    registerRoute('ut-apk:apks').path('apks').parent(mainRoute);
    registerRoute('ut-apk:apkCreate').path('create').parent('ut-apk:apks');
    registerRoute('ut-apk:apkEdit').path('edit/:id').parent('ut-apk:apks');
    registerRoute('ut-apk:apkApprove').path('validate/:id').parent('ut-apk:apks');

    return mainRoute;
};
