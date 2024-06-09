import { SafeUrl } from "@angular/platform-browser";



export interface FileHandle{
  [x: string]: any;
  file:File ,
  url: SafeUrl
}
