import { Component, Input, OnInit } from '@angular/core';
import { BoardsService, ICard, ILabel, IProblema } from 'src/app/service/boards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  modal: boolean = false
  @Input() card: ICard
  @Input() problemas: IProblema[]

  constructor(private boardSevice: BoardsService) {
   }

  ngOnInit(): void {
    
  }

  dragStart(ev: DragEvent){
    ev.dataTransfer?.setData("text", this.card._id.toString())
  }

  OpenModal(){
    const fundo = document.getElementById('board')
    if(fundo){
      fundo.scroll()
      fundo.style.backgroundColor = '#80808080'; 
    }
  }

  toggle(){
    this.modal = !this.modal;

  }

  /**
   * const fundo = document.getElementById('board')
    if(fundo){
      if(this.modal){
        fundo.style.pointerEvents = 'none'
      } else {
        fundo.style.pointerEvents = 'all'
      }
    }
   */

}
