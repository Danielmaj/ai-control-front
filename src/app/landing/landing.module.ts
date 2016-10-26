import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ROUTES } from './landing.routes';
import { LandingComponent } from './landing.component';
import { WorldComponent } from './world';

import { SharedModule } from '../shared';
import { WorldModule } from './world';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import '../../../public/css/dragula.min.css';

@NgModule({
    imports: [ ROUTES, CommonModule, SharedModule, WorldModule, DragulaModule ],
    declarations: [ LandingComponent, WorldComponent ],
})
export class LandingModule {}