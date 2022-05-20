import { IBoard, ILabel, ILista, IProblema, IUser } from "src/app/service/boards.service";

export class BoardModel implements IBoard {
    _id: string;
    titulo: string;
    descricao: string;
    dono: IUser
    integrantes: IUser[];
    listas: ILista[];
    problemas: IProblema[];
    labels: ILabel[];

    /* constructor(board: BoardPage) {
        this.id = board.id
        this.nome = board.nome
        this.descricao = board.descricao
        this.dono = board.dono
        this.listas = board.listas
        this.problemas = board.problemas
        this.labels = board.labels
    } */

    constructor(){

    }

    setBoard(board: IBoard){
        this._id = board._id
        this.titulo = board.titulo
        this.descricao = board.descricao
        this.dono = board.dono
        this.listas = board.listas
        this.problemas = board.problemas
        this.labels = board.labels
    }
}