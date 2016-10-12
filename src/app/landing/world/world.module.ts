import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SquareComponent } from './square';


@NgModule({
    imports: [ CommonModule ],
    declarations: [ SquareComponent ],
    exports: [ SquareComponent ]
})
export class WorldModule {}