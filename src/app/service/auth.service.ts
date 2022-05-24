import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType } from '../store/reducers/auth.state';
import { api } from './api';
import { tokenkey } from '../guard/auth.guard';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private HttpCliente: HttpClient, private route: Router) {}

  login(email: string, password: string){
    return this.HttpCliente.post<UserType>(api.concat('/login'), {
      email: email,
      password: password
    })
  }

  getToken(){
    const token = window.localStorage.getItem(tokenkey)
    if(token){
      return token
    }
    window.localStorage.clear()
    this.route.navigate(['/login'])
    return ''
  }
}
