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

  CriarCard(titulo: string, projeto_id: string, inicio: Date, previsao: Date, lista_id: string){
    const token = this.auth.getToken()
    const res = this.HttpClient.post<ICard>(api.concat('/card'), {
      titulo: titulo,
      projeto_id: projeto_id,
      dataInicio: inicio,
      dataPrevisao: previsao,
      lista_id: lista_id
    },{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    res.subscribe(card => {
      const boardString = window.localStorage.getItem('board')
      if(boardString){
        const local: {id: string, board: IBoard} = JSON.parse(boardString)
        local.board.listas.map(lista => {
          if(lista._id === lista_id){
            lista.cards.push(card)
          }
        })
        window.localStorage.setItem('board',  JSON.stringify({
          id: local.board._id,
          board: local.board
        }))
      }
    }, error => {
      console.log(error)
    })
  }


}
