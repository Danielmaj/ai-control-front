import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutModule } from './about';
import { LandingModule } from './landing';
import { VisualizationModule } from './visualization';

const routes: Routes = [
    { path: '', loadChildren: () => LandingModule },
    { path: 'visualization', loadChildren: () => VisualizationModule },
    { path: 'about', loadChildren: () => AboutModule },
];

export const ROUTES: ModuleWithProviders = RouterModule.forRoot(routes);