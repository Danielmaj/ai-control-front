import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { TableComponent } from './table';
// import { InputComponent } from './input';
import { NavbarComponent } from './navbar';
import { WorldComponent, WorldModule } from '../landing/world';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  imports:      [ CommonModule, RouterModule, FormsModule, WorldModule, DragulaModule ],
  declarations: [ NavbarComponent, WorldComponent ],
  exports:      [ NavbarComponent, WorldComponent ]
})
export class SharedModule { }