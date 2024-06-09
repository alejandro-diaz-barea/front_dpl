import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { UsersComponent } from './pages/users/users.component';
import { SuperuserGuard } from '../auth/guards';



const routes: Routes = [
  {
    path:'',
    component:LayoutPageComponent,
    children: [
      {

        path:'users',
        canActivate:[SuperuserGuard],
        component:UsersComponent
      }
    ]

  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }



// const routes: Routes = [
//   {
//     path: '',
//     component: LayoutPageComponent,
//     children: [
//       {
//         path: 'login',
//         canActivate: [PublicGuard],
//         component: LoginPageComponent
//       },
//       {
//         path: 'new-account',
//         canActivate: [PublicGuard],
//         component: RegisterPageComponent
//       },
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AuthRoutingModule { }
