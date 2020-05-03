import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface UserRegister {
  firstName:string,
  lastName:string,
  email:string,
  password:string,
  confirmPasword:string
}

interface Ret {
  code:number,
  data:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private readonly http:HttpClient, 
    private readonly router:Router) { }

  checkRetAuth(ret:Ret):boolean{
    if (ret && ret.code === 200 && ret.data) {
      localStorage.setItem('jwtToken', ret.data);
      return true;
    }
    return false;
  }

  login(email:string, password:string) {
    const body = {email, password};
    return this.http.post<Ret>("/auth/login", body)
      .toPromise();
  }

  register(user:UserRegister) {
    return this.http.post<Ret>("/auth/register", user)
      .toPromise()
      .then(this.checkRetAuth)
      .catch(reason => {
        console.error(reason);
        return false;
      });
  }

  logOut() {
    const token = localStorage.getItem("jwtToken");
    const options = {
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };
    return this.http.post("/auth/logOut", null, options)
      .toPromise();
  }

  async isLogged():Promise<boolean> {
    const token = localStorage.getItem("jwtToken");
    const options = {
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };

    if (token === null) {
      this.router.navigateByUrl("/auth/login");
      return false;
    }

    try {
      const isLogged = await this.http.post("/auth/isLogged", null, options)
      .toPromise();
      if (!isLogged) {
        this.router.navigateByUrl("/auth/login");
        return false;
      }
    } catch(e) {
      this.router.navigateByUrl("/auth/login");
        return false;
    }

    return true;
  }
}