import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductsRoutingModule } from './products-routing-module';
import { SharedModule } from '../shared/shared.module';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MyProductsPageComponent } from './pages/my-products-page/my-products-page.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';



@NgModule({
  declarations: [
    HomePageComponent,
    LayoutPageComponent,
    ContactPageComponent,
    SellPageComponent,
    ExplorePageComponent,
    MessagePageComponent,
    ProfilePageComponent,
    SearchBarComponent,
    DropdownComponent,
    PaginationComponent,
    MyProductsPageComponent,
    FiltersComponent,
    ChatsPageComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
    ]
})
export class ProductsModule { }
