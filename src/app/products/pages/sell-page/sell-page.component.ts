import { Component, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileHandle } from '../../interfaces/file-handle.model';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnDestroy {
  product: Product = {
    id:0,
    name: "",
    description: "",
    price: 0,
    productImages: [],
    categories: [],
    image_path: "",
    seller_id:0
  };

  productForm: FormGroup;
  fieldErrors: { [key: string]: boolean } = {
    name: false,
    description: false,
    price: false
  };
  successMessage: string = '';
  errorMessage: string = '';
  filterError: boolean = false;
  formSubmitted: boolean = false;
  private successTimeout: any;
  productId: number | null = null;
  isUpdated: boolean | undefined;
  nameMaxLengthReached: boolean = false;
  descriptionMaxLengthReached: boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private authservice : AuthService

  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    clearTimeout(this.successTimeout);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isUpdated = true;
        this.productId = +id;
        this.loadProduct(this.productId);

      }
    });
  }

   // Método para validar la longitud del nombre
   validateNameLength() {
    const nameValue = this.productForm.value.name;
    this.nameMaxLengthReached = nameValue.length > 25;
  }

  // Método para validar la longitud de la descripción
  validateDescriptionLength() {
    const descriptionValue = this.productForm.value.description;
    this.descriptionMaxLengthReached = descriptionValue.length > 130;
  }


  get token(){
    return this.authservice.currentUserInfo?.access_token
  }


  loadProduct(id: number) {

    const token = this.token
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get<Product>(`http://127.0.0.1:8000/api/v1/products/${id}`, { headers }).subscribe(
        product => {
          console.log(product)
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price
          });

        },
        error => {
          console.error('Error loading product:', error);
        }
      );
    }
  }

  validateField(fieldName: string) {
    const control = this.productForm.get(fieldName);
    if (control && control.invalid && control.errors?.['required']) {
      this.fieldErrors[fieldName] = true;
    } else {
      this.fieldErrors[fieldName] = false;
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = window.URL.createObjectURL(file);
      const fileHandle: FileHandle = { file, url };
      this.product.productImages.push(fileHandle);
    }
  }

  removeImage(index: number) {
    this.product.productImages.splice(index, 1);
  }

  addFilter(categoryIdStr: string) {
    if (categoryIdStr.trim().length === 0) {
      this.filterError = true;
    } else {
      this.filterError = false;
      if (!this.product.categories.includes(categoryIdStr)) {
        this.product.categories.push(categoryIdStr);
      }
    }
  }

  removeFilter(index: number) {
    this.product.categories.splice(index, 1);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.productForm.invalid || this.product.categories.length === 0 || this.product.productImages.length === 0) {
      console.error('El formulario no es válido.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);

    if (this.product.productImages.length > 0) {
      this.product.productImages.forEach((fileHandle: FileHandle) => {
        formData.append('images[]', fileHandle.file);
      });
    }

    this.product.categories.forEach((categoryId, index) => {
      formData.append(`categories[${index}]`, categoryId);
    });

    const token = this.token

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post<any>('http://127.0.0.1:8000/api/v1/products', formData, { headers }).subscribe(
        response => {
          console.log("Product created: " + response)
          this.successMessage = 'Product created successfully';
          this.errorMessage = '';
          this.productForm.reset();
          this.product = {
            id:0,
            name: "",
            description: "",
            price: 0,
            productImages: [],
            categories: [],
            image_path: "",
            seller_id:0
          };
          this.formSubmitted = false;

          // Display success message for 3 seconds
          this.successTimeout = setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error => {
          this.errorMessage = 'Error creating the product. Please try again later';
          this.successMessage = '';
          console.error('Error al crear el producto:', error);
        }
      );
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }


  onSubmitUpload(event: Event){
    event.preventDefault();
  }
}
