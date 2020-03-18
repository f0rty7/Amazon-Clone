import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message: string = '';
  messageType: string = 'danger';

  user: any;

  constructor(private router: Router) {
    this.router.events.subscribe( event => {
      if(event instanceof NavigationStart){
        this.message = '';
      }
    })
  }

  error(message: string){
    this.messageType = 'danger';
    this.message = message;
  }

  success(message: string){
    this.messageType = 'success';
    this.message = message;
  }

  warning(message: string){
    this.messageType = 'warning';
    this.message = message;
  }
}
