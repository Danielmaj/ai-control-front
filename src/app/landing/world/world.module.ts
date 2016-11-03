import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { SquareComponent } from './square';

import { World } from '../../models';

@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [ SquareComponent ],
    exports: [ SquareComponent ]
})
export class WorldModule {}