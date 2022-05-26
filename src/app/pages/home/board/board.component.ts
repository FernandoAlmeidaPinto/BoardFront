import { Component, OnInit, Output } from '@angular/core';
import { BoardsService, IBoard, ICard, ILista} from 'src/app/service/boards.service';
import { ListaService } from 'src/app/service/lista.service';
import { socket } from 'src/app/service/socket';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  AddListModal: boolean = false
  rota: string = ''
  board: IBoard
  tituloLista: string

  constructor(private boardService: BoardsService, private listService: ListaService) {
    this.board = JSON.parse(window.localStorage.getItem('board') || '').board
    this.boardService.GetBoard(this.board._id)
  }
  ngOnInit(): void {
    socket.on('AtualizaListas', (lista: ILista) => {
      this.board.listas.push(lista)
      window.localStorage.setItem('board', JSON.stringify({
        id: this.board._id,
        board: this.board
      }))
    })

    socket.on("NotificaListaDeletada", (listaId:string) => {
      for(let i = 0; i < this.board.listas.length; i++) {
        if(this.board.listas[i]._id == listaId){
          this.board.listas.splice(i, 1)
        }
      }
    })

    socket.on('NotificaCriacaoCard', (data: {lista_id: string, card: ICard}) => {
      this.board.listas.map(lista => {
        if(lista._id === data.lista_id){
          lista.cards.push(data.card)
        }
      })
    })
  }

  allowDrop(ev: any) {
    ev.preventDefault()
  }

  drop(ev: any){
    ev.preventDefault()
    const data = ev.dataTransfer.getData('lista')
    if(data.includes('lista_')){
      let target = ev.target
      let alvo = ev.target
      while(!alvo.className.includes('draggble_list m-2')) {
        alvo = alvo.parentNode
      }
      const targetClassName = target.className
      while(!target.className.includes('allListas')){
        target = target.parentNode
      }
      const afterElement = this.getDragAfterElement(target, ev.clientX)
      let next = alvo.nextSibling
      while(next != undefined){
        if(document.getElementById(data) == next){
          break
        }
        next = next.nextSibling
      }
        if(next != undefined){
          this.boardService.MudarLista(this.board._id ,data.replace('lista_', ''), alvo.getAttribute('id').replace('lista_', ''))
          target.insertBefore(document.getElementById(data), alvo)
      } else {
          this.boardService.MudarLista(this.board._id ,data.replace('lista_', ''), alvo.getAttribute('id').replace('lista_', ''))
          target.insertBefore(document.getElementById(data), alvo.nextSibling)
      }
    }
  }

  dropCard(ev: any) {
    ev.preventDefault()
    const data = ev.dataTransfer.getData('card')
    if(data.includes('card_')) {
      let target = ev.target
      if(target.className.includes('list__title')){
        target = target.nextElementSibling
      }
      else if(target.className.includes('draggble_list')){
        target = target.firstChild.nextElementSibling
      }
      else if(target.className.includes('card__text__button') ||
      target.className.includes('icon')) {
        target = target.parentNode.previousSibling
      }
      else if(target.className.includes('path_icon')){
        target = target.parentNode.parentNode.previousSibling
      }
      else if(target.className.includes('button')){
        target = target.previousSibling
      }
      else {
        while(!target.className.includes('cards')){
          target = target.parentNode
        }
      }
      const card = document.getElementById(data)
      if(card){
        const listaRemove = card.parentElement?.parentElement?.getAttribute('id')?.replace('lista_', '')
        const listaAdd = target.parentElement.getAttribute('id').replace('lista_', '')
        const card_id = card.getAttribute('id')?.replace('card_', '')
        if(listaRemove && card_id){
          const quant = target.parentElement.childElementCount
          this.boardService.MudarCard(listaRemove, listaAdd, card_id, quant)
          target.appendChild(document.getElementById(data))
        }
      }

      }
  }

  DragStart(ev: any) {
    ev.dataTransfer?.setData('lista', ev.target.id)
    setTimeout(() => {
      ev.target.style.display = 'block'
      ev.target.style.opacity = 0
    }, 0)
    ev.target.classList.add('dragging')
  }

  DragEnd(ev: any) {
    ev.target.classList.remove('dragging')
    setTimeout(() => {
      ev.target.style.display = 'block'
      ev.target.style.opacity = 1
    }, 0)  
  }

  getDragAfterElement(container: any, x: number) {
    const graggbleElements = [...container.querySelectorAll('.draggble_list:not(.dragging)')]
  
    return graggbleElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = x - box.left - box.width / 2
      if(offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child}
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY}).element
  }

  toggle(){
    this.AddListModal = !this.AddListModal;
    const fundo = document.getElementById('board')
    if(fundo){
      if(this.AddListModal){
        fundo.scroll()
        fundo.style.backgroundColor = '#80808080';

        fundo.style.pointerEvents = 'none'
      } else {
        fundo.style.backgroundColor = '#fff';
        fundo.style.pointerEvents = 'all'
      }
    }
  }

  CriarLista(){
    if(this.tituloLista != '' && this.tituloLista != undefined){
      this.listService.CriarLista(this.tituloLista, this.board._id).subscribe(res => {
        this.board.listas.push(res)
        window.localStorage.setItem('board', JSON.stringify({
          id: this.board._id,
          board: this.board
        }))
      }, err => {
        console.log(err)
      })
      this.toggle()
    }
  }

}
