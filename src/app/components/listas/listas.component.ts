import { Component, Input, OnInit, Output } from '@angular/core';
import { BoardsService, IBoard, ILabel, ILista, IProjeto } from 'src/app/service/boards.service';
import { CardService } from 'src/app/service/card.service';
import { ListaService } from 'src/app/service/lista.service';
import { socket } from 'src/app/service/socket';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  modal: boolean = false

  hiddenLabel = 'hidden'
  hiddenCriaLabel = 'hidden'
  displayMenuUser = 'hidden'

  novoLabel = ''
  novaCorlabel: string[] = []

  @Input() boardId: string
  @Input() lista: ILista
  @Input() projetos: IProjeto[]
  @Input() labels: ILabel[]

  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);

  tituloCard: string = ''
  projeto_id_card: string = ''
  dataInicio: Date
  dataPrevisao: Date

  listaLabelColor: string[][] = [
    ["#ff0000", "#fff"],
    ["#ff8400", "#fff"],
    ["#ffb700", "#fff"],
    ["#d9ff00", "#000"],
    ["#6aff00", "#000"],
    ["#09ff00", "#000"],
    ["#00ff91", "#000"],
    ["#00aeff", "#fff"],
    ["#001eff", "#fff"],
    ["#6200ff", "#fff"],
    ["#ea00ff", "#fff"],
    ["#ff00ae", "#fff"],
    ["#363636", "#fff"],
    ["#000000", "#fff"],
  ]

  teste = "bg-[color:var(--color-list1)]"

  
  constructor(private cardService: CardService, private listaService: ListaService, private boardService: BoardsService) {}
  
  ngOnInit(): void {
    socket.on('CriaLabel', label => {
      console.log(label)
      this.labels.push(label)
      const boardJSON = localStorage.getItem('board')
      if(boardJSON){
        const local: {id: string, board: IBoard} = JSON.parse(boardJSON)
        local.board.labels = this.labels
        this.boardService.AtualizaLocalStorage(local.board)
      }

    })
  }

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

  MenuSetLabel(){
    if(this.hiddenLabel == 'hidden'){
      this.hiddenLabel = ''
    } else {
      this.hiddenLabel = 'hidden'
    }
  }

  MenuCriaLabel(){
    this.MenuSetLabel()
    if(this.hiddenCriaLabel == 'hidden'){
      this.hiddenCriaLabel = ''
    } else {
      this.hiddenCriaLabel = 'hidden'
    }
  }

  modelChangeFn(e:any) {
    this.novoLabel = e;
  }

  SetLabel(cor: string[]){
    this.novaCorlabel = cor
  }

  CriaLabel() {
    if(this.novaCorlabel.length && this.novoLabel){
      this.boardService.CriaLabel(this.novoLabel, this.novaCorlabel[0], this.boardId).subscribe(res => {
        this.labels.push(res as ILabel)
      }, err => {

      })
    }
  }

  getCorText(cor: string): string{
    for(let i = 0; i < this.listaLabelColor.length; i++){
      if(this.listaLabelColor[i][0] == cor){
        return this.listaLabelColor[i][1]
      }
    }
    return '#fff'
  }
}
