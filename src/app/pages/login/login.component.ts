import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { tokenkey } from 'src/app/guard/auth.guard';
import { UserTypeState } from 'src/app/store/reducers/auth.state';
import { Store } from '@ngrx/store';
import { loginAction } from 'src/app/store/actions/authActions/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''

  constructor(private authService: AuthService, private router: Router, private store: Store<{ auth: UserTypeState}>) { }

  ngOnInit(): void {
  }

  login(){
    this.authService.login(this.email, this.password).subscribe((res) => {
      window.localStorage.setItem(tokenkey, res.token)
      this.store.dispatch(loginAction(res.user))
      this.router.navigate(['home']) 
    }, (err) => {
      console.log(err.error.error)
    })
  }

}
