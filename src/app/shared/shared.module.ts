import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { TableComponent } from './table';
// import { InputComponent } from './input';
import { NavbarComponent } from './navbar';

@NgModule({
  imports:      [ CommonModule, RouterModule, FormsModule ],
  declarations: [ NavbarComponent ],
  exports:      [ NavbarComponent ]
})
export class SharedModule { }