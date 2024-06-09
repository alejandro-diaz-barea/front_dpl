import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit {
  products$: Observable<Product[]> = of([]);
  filteredProducts$: Observable<Product[]> = of([]);
  totalPages: number = 1;
  currentPage: number = 1;
  searchTerm: string = '';
  orderBy: string = '';
  categories: Category[] = [];
  selectedCategories: number[] = [];
  showFilterPopup: boolean = false;
  errorMessage: string = '';
  errorMessagePopUp: string= '';
  showErrorPopup: boolean = false; // Propiedad agregada

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number): void {
    this.currentPage = page;
    let params = `?page=${page}`;
    if (this.searchTerm) {
      params += `&search=${encodeURIComponent(this.searchTerm)}`;
    }
    if (this.orderBy) {
      params += `&orderby=${this.orderBy}`;
    }
    if (this.selectedCategories.length > 0) {
      params += `&categories=${this.selectedCategories.join(',')}`;
    }

    this.http.get<any>(`https://backenddpl-production.up.railway.app/api/v1/products${params}`).pipe(
      tap((response: any) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          this.totalPages = response.data.last_page;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No products found matching the specified criteria.';
        }
      }),
      map((response: any) => {
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data.map((product: Product) => ({
            ...product,
            currentImageIndex: 0,
            productImages: JSON.parse(product.image_path).map((imagePath: string) =>
              imagePath.replace('/storage', '/storage')
            )
          }));
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Products not found';
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products$ = of(products);
      this.filteredProducts$ = of(products);
    }, error => {
      console.error('HTTP request error:', error);
      this.errorMessage = 'Products not found';
    });
  }

  searchProducts(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.loadProducts(1);
  }

  onOrderChange(orderBy: string): void {
    this.orderBy = orderBy;
    this.loadProducts(1);
  }

  filterByCategory(categoryId: number): void {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.loadProducts(1);
  }

  toggleFilterPopup(): void {
    this.showFilterPopup = !this.showFilterPopup;
  }

  handleFilterApplied(selectedCategories: number[]): void {
    this.selectedCategories = selectedCategories;
    this.loadProducts(1);
  }

  nextImage(product: Product): void {
    if (product.currentImageIndex !== undefined) {
      product.currentImageIndex = (product.currentImageIndex + 1) % product.productImages.length;
    } else {
      product.currentImageIndex = 0;
    }
  }

  get token(){
    return this.authService.currentUserInfo?.access_token
  }

  contactSeller(sellerId: number): void {
    if (!this.authService.isUserLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const token = this.token
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const payload = { user2_id: sellerId };

      this.http.post('https://backenddpl-production.up.railway.app/api/v1/chats', payload, { headers })
        .subscribe(
          (response) => {
            console.log('Chat created:', response);
            this.router.navigate(['/chats']);
          },
          (error) => {
            console.error('Error creating chat:', error);
            if (error.error.message === 'You cannot chat with yourself.') {
              this.errorMessagePopUp = 'You cannot chat with yourself.';
            } else if (error.error.message === 'A chat already exists between these users.') {
              this.errorMessagePopUp = 'A chat already exists between these users.';
            } else {
              this.errorMessagePopUp = 'An error occurred while creating the chat.';
            }
            this.showErrorPopup = true;
            setTimeout(() => {
              this.showErrorPopup = false;
            }, 2000);
          }
        );
    } else {
      console.error('Authentication token not found.');
    }
  }

  get isAdmin(): boolean | undefined {
    return this.authService.currentUserInfo?.is_super;
  }

  deleteProduct(productId: number): void {
    const token = this.token
    if (!token) {
      console.error('Token de autenticación no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<any>(`https://backenddpl-production.up.railway.app/api/v1/products/${productId}`, { headers }).subscribe(
      () => {
        console.log('Producto eliminado:', productId);
        this.loadProducts(this.currentPage);
      },
      error => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }
}
