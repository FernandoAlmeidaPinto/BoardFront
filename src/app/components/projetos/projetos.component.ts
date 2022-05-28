import { Component, Input, OnInit } from '@angular/core';
import { IProjeto } from 'src/app/service/boards.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent implements OnInit {

  @Input() projetos: IProjeto[]

  modal: boolean = true

  timeElapsed = Date.now();
  today: Date = new Date(this.timeElapsed);

  titulo: string = ''
  descricao: string = ''
  dataInicio: Date
  dataPrevisao: Date
  cor: string = '#ff0000'

  listaProjetolColor: string[] = [
    "#ff0000",
    "#ff8400",
    "#ffb700",
    "#d9ff00",
    "#6aff00",
    "#09ff00",
    "#00ff91",
    "#00aeff",
    "#001eff",
    "#6200ff",
    "#ea00ff",
    "#ff00ae",
    "#363636",
    "#000000",
  ]

  borderColor = `0.1rem gray solid`

  constructor() { }

  ngOnInit(): void {
  }

  CriaProjetos() {
    if(this.titulo && this.descricao && this.dataInicio && this.dataPrevisao && this.cor){
      this.toggle()
    }
  }

  toggle(){
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

  SetCor(cor: string){
    this.cor = cor
    this.borderColor = `0.5rem ${this.cor} solid`
  }

}
