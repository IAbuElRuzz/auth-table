import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/auth/auth.guard';
import { LoginComponent } from 'src/app/components/login/login.component';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent,

  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
      { path: 'sales', loadChildren: () => import('./components/sales/sales.module').then(m => m.SalesModule) },
      { path: 'new-product', loadChildren: () => import('./components/new-product/new-product.module').then(m => m.NewProductModule) },
    ]
  },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    //  RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
