import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../../interfaces/product.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-my-products-page',
  templateUrl: './my-products-page.component.html',
  styleUrls: ['./my-products-page.component.css']
})
export class MyProductsPageComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  errorMessage: string = '';

  // Variable para almacenar el producto que se va a eliminar
  productToDelete: Product | null = null;

  constructor(private http: HttpClient, private authservice: AuthService) { }

  ngOnInit(): void {
    this.loadMyProducts();
  }

  get token(){
    return this.authservice.currentUserInfo?.access_token
  }


  loadMyProducts(): void {
    const token = this.token

    if (!token) {
      console.error('Token de autenticación no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // My products
    this.http.get<any>('https://backenddpl-production.up.railway.app/api/v1/user-products', { headers }).pipe(
      tap((response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No se encontraron productos.';
        }
      }),
      map((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          return response.data.map((product: any) => ({
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
        console.error('Error al obtener los productos:', error);
        this.errorMessage = 'Products not found';
        return of([]);
      })
    ).subscribe((products: any[]) => {
      this.products$ = of(products);
      this.filteredProducts$ = of(products);
    }, error => {
      // Handle HTTP request error here
      console.error('Error en la solicitud HTTP:', error);
      this.errorMessage = 'Products not found';
    });
  }

  nextImage(product: Product): void {
    if (product.currentImageIndex !== undefined) {
      product.currentImageIndex = (product.currentImageIndex + 1) % product.productImages.length;
    } else {
      product.currentImageIndex = 0;
    }
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

// Método para eliminar un producto
deleteProduct(): void {
  if (this.productToDelete) {
    const productId = this.productToDelete.id;

    const token = this.token

    if (!token) {
      console.error('Token de autenticación no encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // DELETE
    this.http.delete<any>(`https://backenddpl-production.up.railway.app/api/v1/products/${productId}`, { headers }).subscribe(() => {
      console.log('Producto eliminado:', this.productToDelete);
      this.loadMyProducts(); // Recargar la lista de productos después de eliminar
      this.productToDelete = null; // Limpiar el producto a eliminar después de eliminarlo
    }, error => {
      console.error('Error al eliminar el producto:', error);
    });
  }
}

}
