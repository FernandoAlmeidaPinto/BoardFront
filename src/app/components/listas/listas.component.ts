import { Component, Input, OnInit } from '@angular/core';
import { BoardsService, IBoard, ICard, ILista, IProblema } from 'src/app/service/boards.service';
import { CardService } from 'src/app/service/card.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  modal: boolean = false

  @Input() lista: ILista
  @Input() problemas: IProblema[]

  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);

  tituloCard: string = ''
  problema_id_card: string = ''
  dataInicio: Date
  dataPrevisao: Date
  
  constructor(private board: BoardsService, private cardService: CardService) {}
  
  ngOnInit(): void {}

  allowDrop($event: DragEvent) {
    $event.preventDefault();
  }

  DragStart(ev: any) {
    ev.dataTransfer?.setData('card', ev.target.id)
  }

  DragEnd(ev: any) {
    ev.preventDefault();
  }

  CriaCard(){
    if(this.tituloCard && this.problema_id_card && this.dataInicio && this.dataPrevisao){
      this.cardService.CriarCard(this.tituloCard, this.problema_id_card, this.dataInicio, this.dataPrevisao, this.lista._id).subscribe(card => {
        const boardString = window.localStorage.getItem('board')
        if(boardString){
          const local: {id: string, board: IBoard} = JSON.parse(boardString)
          local.board.listas.map(lista => {
            if(lista._id === this.lista._id){
              lista.cards.push(card)
              this.lista.cards.push(card)
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
      this.toogle()
    }
  }

  toogle(){
    this.modal = !this.modal;
    const fundo = document.getElementById('board')
    const listas = document.getElementsByClassName('draggble_list')
    const card = document.getElementsByClassName('draggable_card')
    if(fundo){
      if(this.modal){
        for(let i = 0; i < listas.length; i++){
          listas[i].setAttribute('draggable', 'false')
        }
        for(let i = 0; i < card.length; i++){
          card[i].setAttribute('draggable', 'false')
        }
        fundo.style.backgroundColor = '#80808080';
        fundo.style.pointerEvents = 'none'
      } else {
        for(let i = 0; i < listas.length; i++){
          listas[i].setAttribute('draggable', 'true')
        }
        for(let i = 0; i < card.length; i++){
          card[i].setAttribute('draggable', 'true')
        }
        fundo.style.backgroundColor = '#fff';
        fundo.style.pointerEvents = 'all'
      }
    }
  }

}
