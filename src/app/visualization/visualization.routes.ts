import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizationComponent } from './visualization.component';


const routes: Routes = [
    { path: '', component: VisualizationComponent },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(routes);