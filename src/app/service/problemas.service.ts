import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenkey } from '../guard/auth.guard';
import { api } from './api';
import { IProblema } from './boards.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemasService {

  constructor(private HttpCliente: HttpClient) {}

  listarProblemas(board: number) {
    const token = window.localStorage.getItem(tokenkey)
    return this.HttpCliente.get<IProblema[]>(api.concat(`/problema/${board}`), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }
}
