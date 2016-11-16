import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ROUTES } from './about.routes';
import { AboutComponent } from './about.component';

import { SharedModule } from '../shared';

@NgModule({
    imports: [ ROUTES, CommonModule, SharedModule, FormsModule ],
    declarations: [ AboutComponent ],
})
export class AboutModule {}