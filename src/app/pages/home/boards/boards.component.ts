import { Component, OnInit } from '@angular/core';
import { IBoard, BoardsService } from 'src/app/service/boards.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { socket, connect } from 'src/app/service/socket';


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

  constructor(private boardService: BoardsService, private route: Router, private auth: AuthService) {
    connect(this.auth.getToken())
    this.boardService.ListarBoards().then(res => {
      this.listaBoards = res
    })
  }
  
  ngOnInit(): void {
    socket.on('AtualizaBoards', data => {
      this.listaBoards = data
  })
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
    this.boardService.GetBoard(id)
    setTimeout(()=>{
      this.route.navigate([`home/board/${id}`])
    }, 100)
  }
  
}
