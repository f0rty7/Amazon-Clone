import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate{

  constructor(
    private router: Router,
  ) { }

  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
    if(localStorage.getItem('token')){
      // this.router.navigate(['/']);
      // return false;
      return state.url.startsWith('/profile') ? true : (this.router.navigate['/'], false);
    } else {
      // return true;
      return state.url.startsWith('/profile') ? (this.router.navigate['/'], false) : true;
    }
  }
}
