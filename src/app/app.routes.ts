import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingModule } from './landing';
import { AboutModule } from './about';

const routes: Routes = [
    // { path: 'page', loadChildren: () => require('es6-promise!./home/home.module')('HomeModule') },
    { path: '', loadChildren: () => LandingModule },
    { path: 'about', loadChildren: () => AboutModule },
    // { path: '', loadChildren: () => require('es6-promise!./profile/profile.module')('ProfileModule') },
    // { path: '**', loadChildren: () => require('es6-promise!./home/home.module')('HomeModule'), pathMatch: 'full' },
];

export const ROUTES: ModuleWithProviders = RouterModule.forRoot(routes);