import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { api } from './api';
import { AuthService } from './auth.service';

export interface IBoard {
  _id: string
  titulo: string
  descricao: string
  integrantes: IUser[]
  dono: IUser
  listas: ILista[]
  projetos: IProjeto[]
  labels: ILabel[]
}

export interface ILabel {
  _id: string
  titulo: string
  cor: string
}

export interface ICard {
  _id: string
  titulo: string
  dono: IUser
  projeto: IProjeto
  label: ILabel[]
  dataInicio: Date
  dataPrevisao: Date
  dataEntrega: Date
}

export interface ILista {
  _id: string
  titulo: string
  cards: ICard[]
}

export interface IProjeto {
  _id: string
  titulo: string
  descricao: string
  dataInicio: Date
  dataPrevisao: Date
  dataEntrega: Date
  cor: string
}

export interface IUser {
  _id: string
  email: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  MinhaListaBoard: IBoard[]

  constructor(private HttpCliente: HttpClient, private auth: AuthService, private route: Router) {
    
   }

  async ListarBoards(): Promise<IBoard[]> {
    const token = this.auth.getToken()
    const res = this.HttpCliente.get<IBoard[]>(api.concat(`/board`), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).toPromise()
    res.then(data => {
      this.MinhaListaBoard = data
    }, err=> {
      window.localStorage.clear()
      this.route.navigate(['/login'])
    })
    return res
  }

  GetBoard(id: string) {
    const token = this.auth.getToken()
    const board = this.HttpCliente.get<IBoard>(api.concat(`/board/${id}`), {
      headers: {
        "Authorization": `Bearer ${token}`
        
      }
    })
    board.subscribe(board => {
      window.localStorage.setItem('board', JSON.stringify({
        id: id,
        board: board
      }))
    }, err=> {
      window.localStorage.clear()
      this.route.navigate(['/login'])
    })
  }

  CriarBoard(titulo: string, descricao: string) {
    const token = this.auth.getToken()
    return this.HttpCliente.post<IBoard>(api.concat(`/board`), {
      titulo: titulo,
      descricao: descricao
    },{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }


  MudarLista(board: string, lista1: string, lista2: string){
    let from: number = -1
    let to: number = -1
    const boardString = window.localStorage.getItem('board')
    if(boardString){
      const local: {id: string, board: IBoard} = JSON.parse(boardString)
      local.board.listas.map(lista => {
        if(lista._id == lista1){
          from = local.board.listas.indexOf(lista)
        }
        if(lista._id == lista2){
          to = local.board.listas.indexOf(lista)
        }
      })
      if(from != -1 && to != -1){
        const token = this.auth.getToken()
        const res = this.HttpCliente.patch(api.concat(`/board/lista`), 
          {
            board_id: board,
            from: from,
            to: to
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
        res.subscribe(res => {
            this.ChangePosition(local.board.listas, from, to)
            this.AtualizaLocalStorage(local.board)
        }, error => {
          window.localStorage.clear()
        })
      }
    }
  }

  ChangePosition(arr: any, from: number, to: number){
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
  };

  MudarCardLista(listaRemove: string, listaAdd: string, card_id: string, to: number){
    const token = this.auth.getToken()
    const body = {
      lista_remove_id: listaRemove,
      lista_add_id: listaAdd,
      card_id: card_id,
      to: to
    }
    const res = this.HttpCliente.post(api.concat(`/lista/mudarcard`), 
      body,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    )
    res.subscribe(r => {
      const boardJSON = localStorage.getItem('board')
      let cardJson: ICard
      if(boardJSON){
        const local: {id: string, board: IBoard} = JSON.parse(boardJSON)
        local.board.listas.map(lista => {
          if(lista._id == listaRemove){
            lista.cards.map(card => {
              if(card._id == card_id){
                cardJson = card
                lista.cards.splice(lista.cards.indexOf(card), 1)
              }
            })
          }
        })
        local.board.listas.map(lista => {
          if(lista._id == listaAdd) {
            lista.cards.push(cardJson)
          }
        })
        this.AtualizaLocalStorage(local.board)
      }
    }, error => {
      window.localStorage.clear()
    })
  }

  MudarCard(listaId: string, de: number, para: number){
    if(listaId && de != undefined && para != undefined){
      const token = this.auth.getToken()
      const res = this.HttpCliente.post(api.concat(`/lista/card/`), {
        listaId: listaId,
        de: de,
        para: para
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      res.subscribe(r => {
      }, e=> {
        console.log(e)
        window.localStorage.clear()
      })
    }
  }

  AtualizaLocalStorage(board: IBoard) {
    window.localStorage.setItem('board', JSON.stringify({
      id: board._id,
      board: board
    }))
  }

  CriaLabel(titulo: string, cor: string, boardId: string){
    const token = this.auth.getToken()
    return this.HttpCliente.post(api.concat(`/label`), {
      titulo: titulo,
      cor: cor,
      boardId: boardId
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }

}
