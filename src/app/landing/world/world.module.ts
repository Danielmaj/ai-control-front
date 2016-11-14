import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { SquareComponent } from './square';
import { FillerComponent } from './filler';

import { World } from '../../models';

@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [ SquareComponent, FillerComponent ],
    exports: [ SquareComponent, FillerComponent ]
})
export class WorldModule {}