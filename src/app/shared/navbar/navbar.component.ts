import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ait-navbar',
    styleUrls: ['./navbar.component.css'],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    title: string = "AI control task";
    
    constructor(
    	private _router: Router
    ) {
    }

    ngOnInit() {

    }

}
