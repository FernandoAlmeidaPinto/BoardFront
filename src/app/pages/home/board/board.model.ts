import { IBoard, ILabel, ILista, IProjeto, IUser } from "src/app/service/boards.service";

export class BoardModel implements IBoard {
    _id: string;
    titulo: string;
    descricao: string;
    dono: IUser
    integrantes: IUser[];
    listas: ILista[];
    projetos: IProjeto[];
    labels: ILabel[];

    constructor(){

    }

    setBoard(board: IBoard){
        this._id = board._id
        this.titulo = board.titulo
        this.descricao = board.descricao
        this.dono = board.dono
        this.listas = board.listas
        this.projetos = board.projetos
        this.labels = board.labels
    }
}