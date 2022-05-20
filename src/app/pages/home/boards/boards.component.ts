import { Component, OnInit } from '@angular/core';
import { IBoard, BoardsService } from 'src/app/service/boards.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  modal: boolean = false
  titulo: string = ''
  descricao: string = ''
  listaBoards: IBoard[] = []

  constructor(private boardService: BoardsService, private route: Router) { 
    this.boardService.ListarBoards().subscribe(res => {
      this.listaBoards = res
    }, error => {
      if(error.status === 401) {
        window.localStorage.clear()
        this.route.navigate(['/login'])
      }
    })
  }

  ngOnInit(): void {
    
  }

  Add(){
    this.modal = true
  }

  fecharModal(){
    this.modal = false
  }

  CriarBoard(){
    if(this.titulo !== '' && this.descricao !== ''){
      this.boardService.CriarBoard(this.titulo, this.descricao).subscribe((res)=> {
        this.listaBoards.push(res)
        this.modal = false
      }, error => {
        console.log(error.status)
      })
    }
  }

  

  EntrarBoard(id: string){
    this.boardService.ListaBoard(id)
    setTimeout(()=>{
      this.route.navigate([`home/board/${id}`])
    }, 100)
  }

  
}
