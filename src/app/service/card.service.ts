import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IBoard, ICard } from './boards.service';
import { api } from './api';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private HttpClient: HttpClient, private auth: AuthService) { }

  CriarCard(titulo: string, descricao: string, projetoId: string, inicio: Date, previsao: Date, listaId: string){
    const token = this.auth.getToken()
    return this.HttpClient.post<ICard>(api.concat('/card'), {
      titulo: titulo,
      descricao: descricao,
      projetoId: projetoId,
      dataInicio: inicio,
      dataPrevisao: previsao,
      listaId: listaId
    },{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }
}
