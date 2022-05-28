import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserTypeState } from 'src/app/store/reducers/auth.state';

interface MenuType {
  nome: string,
  index: number
}

interface MenuSuperiorType {
  nome: string,
  href: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menuSuperior: MenuSuperiorType[] = [
    {nome: 'Inicio', href: '/home'},
    {nome: 'Boards', href: '/home/boards'},
    {nome: 'Time', href: '#'},
    {nome: 'Calendario', href: '#'},
  ]

  menuUser: MenuType[] = [
    {nome: 'Perfil', index: 0},
    {nome: 'Configuração', index: 1},
    {nome: 'Sair', index: 2},
  ]

  displayMenuUser = 'hidden'

  user: UserTypeState
  arrayFunction: {[key: string]: () => void} = {
    "Perfil": () => this.Perfil(),
    "Configuração": () => this.Config() ,
    "Sair": () => this.Sair() , 
  }

  constructor(private store: Store<{ auth: UserTypeState}>, private route: Router) { 
    this.store.select('auth').subscribe(e => { this.user = e }) 
  }
  
  ngOnInit(): void {
    
  }

  changeMenu(){
    if(this.displayMenuUser == '') {
      this.displayMenuUser = 'hidden'
    } else {
      this.displayMenuUser = ''
    }
  }

  private Perfil(){
    console.log('Perfil')
  }

  private Config(){
    console.log('Configuração') 
  }

  private Sair(){
    window.localStorage.clear()
    this.route.navigate(['/login'])
  }

}
