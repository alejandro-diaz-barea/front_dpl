import { FileHandle } from "./file-handle.model";


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productImages: FileHandle[];
  categories: string[];
  image_path: string;
  currentImageIndex?:number;
  seller_id:number
}
