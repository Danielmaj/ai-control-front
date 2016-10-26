import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SquareComponent } from './square';

import { World } from '../../models';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ SquareComponent ],
    exports: [ SquareComponent ]
})
export class WorldModule {}