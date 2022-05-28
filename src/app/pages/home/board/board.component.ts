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
    socket.on('AtualizaListas', (listas: ILista[]) => {
      this.board.listas = listas
      this.boardService.AtualizaLocalStorage(this.board)
    })

    socket.on("NotificaListaDeletada", (listaId:string) => {
      for(let i = 0; i < this.board.listas.length; i++) {
        if(this.board.listas[i]._id == listaId){
          this.board.listas.splice(i, 1)
        }
      }
      this.boardService.AtualizaLocalStorage(this.board)
    })

    socket.on('NotificaCriacaoCard', (lista: ILista) => {
      for(let i = 0; i < this.board.listas.length; i++){
        if(this.board.listas[i]._id == lista._id){
          this.board.listas[i] = lista
        }
      }
      this.boardService.AtualizaLocalStorage(this.board)
    })
    socket.on("NotificaTrocaLista", (listas: ILista[]) => {
      this.board.listas = listas
    })
    this.boardService.AtualizaLocalStorage(this.board)

    socket.on('MudarCardOrdem', (lista: ILista) => {
      for(let i = 0; i < this.board.listas.length; i++){
        if(this.board.listas[i]._id == lista._id){
          this.board.listas[i] = lista
        }
      }
      this.boardService.AtualizaLocalStorage(this.board)
    })
  }

  allowDrop(ev: any) {
    ev.preventDefault()
  }

  drop(ev: any){
    ev.preventDefault()
    const data = ev.dataTransfer.getData('lista')
    if(data.includes('lista_')){
      let contexto = ev.target
      let alvo
      let next
      if(!contexto.className.includes('allListas')){
        alvo = ev.target
        while(!alvo.className.includes('draggble_list m-2')) {
          alvo = alvo.parentNode
        }
        next = alvo.nextSibling
        while((next != undefined)){
          try{
            if(next == document.getElementById(data)){
              break
            }
            next = next.nextSibling
          } catch {
            next = undefined
          }
        }
      }
      while(!contexto.className.includes('allListas')){
        contexto = contexto.parentNode
      }
      if(next){
          this.boardService.MudarLista(this.board._id ,data.replace('lista_', ''), alvo.getAttribute('id').replace('lista_', ''))
          contexto.insertBefore(document.getElementById(data), alvo)
      } else if(!alvo){
        contexto.appendChild(document.getElementById(data))
      } else {
          this.boardService.MudarLista(this.board._id ,data.replace('lista_', ''), alvo.getAttribute('id').replace('lista_', ''))
          contexto.insertBefore(document.getElementById(data), alvo.nextSibling)
      }
    }
  }

  dropCard(ev: any) {
    ev.preventDefault()
    let cardTarget
    const data = ev.dataTransfer.getData('card')
    if(data.includes('card_')) {
      let contexto = ev.target
      if(contexto.nodeName === 'path' || contexto.nodeName === 'svg'){
        if(contexto.nodeName === 'path'){
          contexto = contexto.parentNode.parentNode.parentNode
        } else {
          contexto = contexto.parentNode.parentNode
        }
        contexto = contexto.firstChild.nextElementSibling
      }
      else if(contexto.className.includes('list__title')){
        contexto = contexto.parentNode.nextElementSibling
      }
      else if(contexto.className.includes('draggble_list')){
        contexto = contexto.firstChild.nextElementSibling
      }
      else if(contexto.className.includes('card__text__button') ||
      contexto.className.includes('icon')) {
        contexto = contexto.parentNode.previousSibling
      }
      else if(contexto.className.includes('path_icon')){
        contexto = contexto.parentNode.parentNode.previousSibling
      }
      else if(contexto.className.includes('button')){
        contexto = contexto.previousSibling
      }
      else {
        while(!contexto.className.includes('cards')){
          cardTarget = contexto
          contexto = contexto.parentNode
        }
      }
      let next = cardTarget
      while (next != undefined){
        try{
          if(next == document.getElementById(data)){
            break
          }
          next = next.nextSibling
        }catch {
          next = undefined
          break
        }
      }
      const card = document.getElementById(data)
      if(card){
        let listaRemove = card.parentElement
        let listaAdd = contexto
        while (!listaRemove?.className.includes('draggble_list') && listaRemove){
          listaRemove = listaRemove?.parentElement
        }
        while (!listaAdd.className.includes('draggble_list')){
          listaAdd = listaAdd.parentNode
        }
        const card_id = card.getAttribute('id')?.replace('card_', '')
        if(listaAdd && listaRemove && card_id){
          if(listaRemove == listaAdd) {
            let de
            let para
            let filho = contexto.firstChild
            for (let i = 0; i < contexto.childElementCount; i++){
              if(filho == card) de = i
              else if(filho == cardTarget) para = i
              filho = filho.nextSibling
            }
            if(next){
              contexto.insertBefore(document.getElementById(data), cardTarget)
            
            } else if(cardTarget){
                contexto.insertBefore(document.getElementById(data), cardTarget.nextSibling)
            }
            this.boardService.MudarCard(listaRemove.getAttribute('id')?.replace('lista_', '') as string, de as number, para as number)
          }
          else{
            contexto = contexto.parentElement.firstChild.nextElementSibling
            let para
            let filho = contexto.firstChild
            for (let i = 0; i < contexto.childElementCount; i++){
              if(filho == cardTarget) para = i
              filho = filho.nextSibling
            }
            if(!cardTarget){
              para = contexto.childElementCount
              contexto.appendChild(document.getElementById(data))
            } else {
              contexto.insertBefore(document.getElementById(data), cardTarget)
            }
            this.boardService.MudarCardLista(
              listaRemove.getAttribute('id')?.replace('lista_', '') as string,
              listaAdd.getAttribute('id')?.replace('lista_', '') as string,
              card_id,
              para as number
              )
          }
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
