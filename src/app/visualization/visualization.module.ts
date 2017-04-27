import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ROUTES } from './visualization.routes';
import { VisualizationComponent } from './visualization.component';

import { SharedModule } from '../shared';
// import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import '../../../public/css/dragula.min.css';

@NgModule({
    imports: [ ROUTES, CommonModule, SharedModule, FormsModule ],
    declarations: [ VisualizationComponent ],
})
export class VisualizationModule {}