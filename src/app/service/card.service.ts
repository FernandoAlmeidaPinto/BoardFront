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

  CriarCard(titulo: string, problema_id: string, inicio: Date, previsao: Date, lista_id: string){
    const token = this.auth.getToken()
    let returnCard: ICard
    return this.HttpClient.post<ICard>(api.concat('/card'), {
      titulo: titulo,
      problema_id: problema_id,
      dataInicio: inicio,
      dataPrevisao: previsao,
      lista_id: lista_id
    },{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }


}
