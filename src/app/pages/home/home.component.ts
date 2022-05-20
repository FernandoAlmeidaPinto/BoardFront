import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { authInitialState, UserType, UserTypeState } from 'src/app/store/reducers/auth.state';
import { map } from 'rxjs/operators'

interface MenuType {
  nome: string,
  href: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menuSuperior: MenuType[] = [
    {nome: 'Inicio', href: ''},
    {nome: 'Boards', href: '/home/boards'},
    {nome: 'Time', href: '#'},
    {nome: 'Calendario', href: '#'},
  ]

  menuUser: MenuType[] = [
    {nome: 'Perfil', href: ''},
    {nome: 'Configuração', href: ''},
    {nome: 'Sair', href: ''},
  ]

  displayMenuUser = 'hidden'

  user: UserTypeState = {
    id: 0,
    nome: '',
    sobrenome: '',
    email: '',
    area: {
      id: 0,
      nome: '',
      descricao: '',
    },
    cargo: {
      id: 0,
      nome: '',
      descricao: '',
    },
    time: {
      id: 0,
      nome: '',
      descricao: '',
    }

  };

  constructor(private store: Store<{ auth: UserTypeState}>) { 
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

}
