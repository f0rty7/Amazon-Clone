import { MyProductsComponent } from './my-products/my-products.component';
import { PostProductComponent } from './post-product/post-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddressComponent } from './address/address.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGaurdService } from './auth-gaurd.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'profile/settings',
    component: SettingsComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'profile/address',
    component: AddressComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'profile/postproduct',
    component: PostProductComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'profile/myproducts',
    component: MyProductsComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
