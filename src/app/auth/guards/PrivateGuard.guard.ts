import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { inject } from "@angular/core";

export const PrivateGuard: CanActivateChildFn = (route, state) =>{


  const authService = inject(AuthService)
  const router = inject(Router)


  console.log(authService.isUserLoggedIn)


  if ( authService.isUserLoggedIn === true){
    return true
  }

  if ( authService.isUserLoggedIn === false){
    router.navigate(['/explore'])
    return false

  }



  return false

  // get user(): boolean{
  //   return this.authService.isUserLoggedIn;
  // }

}
