import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { getRoute } from 'ut-front/react/routerHelper';
import ApksList from './pages/ApkList';
import { ApkCreate, ApkEdit } from './pages/ApkInfo';

import registerRoutes from './registerRoutes';
import { Home } from './pages/Home';

export const mainRoute = registerRoutes();

export const UtApkRoutes = (config) => {
    return (
        <Route>
            <Route path={getRoute('ut-apk:home')}>
                <IndexRoute component={Home} />
                <Route path={getRoute('ut-apk:apks')}>
                    <IndexRoute component={ApksList} />
                    <Route path={getRoute('ut-apk:apkCreate')} component={ApkCreate} />
                    <Route path={getRoute('ut-apk:apkEdit')} component={ApkEdit} />
                </Route>
            </Route>
        </Route>
    );
};