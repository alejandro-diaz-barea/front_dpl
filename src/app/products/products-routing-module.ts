import { NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { PrivateGuard } from '../auth/guards';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { MyProductsPageComponent } from './pages/my-products-page/my-products-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'contact', component: ContactPageComponent
      },
      {
        path:'sell',
        canActivate:[PrivateGuard],
        component: SellPageComponent
      },
      {
        path: 'sell/:id',
        component: SellPageComponent,
        canActivate: [PrivateGuard]

      },

      {
        path:'chats/messages',
        canActivate:[PrivateGuard],
        component: MessagePageComponent
      },
      {
        path:'chats',
        canActivate:[PrivateGuard],
        component: ChatsPageComponent
      },
      {
        path:'profile',
        canActivate:[PrivateGuard],
        component: ProfilePageComponent
      },
      {
        path:'my-products',
        canActivate:[PrivateGuard],
        component: MyProductsPageComponent
      },
      {
        path:'explore',
        component:ExplorePageComponent
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild( routes)
  ],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }
