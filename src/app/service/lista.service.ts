import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './api';
import { AuthService } from './auth.service';
import { ILista } from './boards.service';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(private HttpClient: HttpClient, private auth: AuthService) { }

  CriarLista(titulo: string, board_id: string) {
    const token = this.auth.getToken()
    return this.HttpClient.post<ILista>(api.concat('/lista'), {
      titulo: titulo,
      board_id: board_id
    },{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }

}
