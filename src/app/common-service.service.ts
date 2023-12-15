import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient, private router: Router, private activedRoute: ActivatedRoute) { }

  public registerUser(data: any){
    return this.http.post('https://uworldtestinterfaceapi.azurewebsites.net/api/Users/register', data)
  }
  
  public getUserDeatils(email:string, password:string) {
    let data= {
      email: email,
      password: password
    }
    return this.http.post(`https://uworldtestinterfaceapi.azurewebsites.net/api/Users/login`, data)
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

  Encrypt(value: any) {
    var result = "";
    for (var i = 0; i < value.length; i++) {
      if (i < value.length - 1) {
        result += value.charCodeAt(i) + 10;
        result += "-";
      }
      else {
        result += value.charCodeAt(i) + 10;
      }
    }
    return result;
  }
  
  Decrypt(value: any) {
    var result = "";
    var array = value.split("-");

    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i] - 10);
    }
    return result;
  }
  
  public getAssignmentsData() {
    return this.http.get('../assets/assignments-data.json');
  }
}
