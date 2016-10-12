import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';


const routes: Routes = [
    { path: '', component: LandingComponent },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(routes);