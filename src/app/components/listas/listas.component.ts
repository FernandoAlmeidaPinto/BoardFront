import { Component, Input, OnInit } from '@angular/core';
import { ILista, IProjeto } from 'src/app/service/boards.service';
import { CardService } from 'src/app/service/card.service';
import { ListaService } from 'src/app/service/lista.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  modal: boolean = false

  @Input() lista: ILista
  @Input() projetos: IProjeto[]

  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);

  tituloCard: string = ''
  projeto_id_card: string = ''
  dataInicio: Date
  dataPrevisao: Date

  displayMenuUser = 'hidden'
  
  constructor(private cardService: CardService, private listaService: ListaService) {}
  
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
    if(this.tituloCard && this.projeto_id_card && this.dataInicio && this.dataPrevisao){
      this.cardService.CriarCard(this.tituloCard, this.projeto_id_card, this.dataInicio, this.dataPrevisao, this.lista._id)
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

  changeMenu(){
    if(this.displayMenuUser == '') {
      this.displayMenuUser = 'hidden'
    } else {
      this.displayMenuUser = ''
    }
  }

  deletaLista() {
    this.listaService.DeletaLista(this.lista._id)
  }

}
