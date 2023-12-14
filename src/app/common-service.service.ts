import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient, private router: Router, private activedRoute: ActivatedRoute) { }

  public registerUser(data: any){
    return this.http.post('https://localhost:44304/api/Users/register', data)
  }
  
  public getUserDeatils(email:string, password:string) {
    return this.http.get(`https://localhost:44304/api/Users/login/${email}/${password}`)
  }

  public checkAndNavigate() {
    let userdetails = localStorage.getItem('userDetails')
    if(userdetails) {
      this.router.navigate(['./home'])
    }
    else {
      if(this.router.url === '/register'){
        return
      }
      else {
        this.router.navigate(['./login'])
      }
    }
  }
}
