import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ROUTES } from './landing.routes';
import { LandingComponent } from './landing.component';
import { WorldComponent } from './world';

import { SharedModule } from '../shared';
import { WorldModule } from './world';

@NgModule({
    imports: [ ROUTES, CommonModule, SharedModule, WorldModule ],
    declarations: [ LandingComponent, WorldComponent ],
})
export class LandingModule {}