import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingModule } from './landing';

const routes: Routes = [
    // { path: 'page', loadChildren: () => require('es6-promise!./home/home.module')('HomeModule') },
    { path: '', loadChildren: () => LandingModule },
    // { path: '', loadChildren: () => require('es6-promise!./profile/profile.module')('ProfileModule') },
    // { path: '**', loadChildren: () => require('es6-promise!./home/home.module')('HomeModule'), pathMatch: 'full' },
];

export const ROUTES: ModuleWithProviders = RouterModule.forRoot(routes);