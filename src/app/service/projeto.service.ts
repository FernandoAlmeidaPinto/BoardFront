import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenkey } from '../guard/auth.guard';
import { api } from './api';
import { IProjeto } from './boards.service';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  constructor(private HttpCliente: HttpClient) {}

  listarProjetos(board: number) {
    const token = window.localStorage.getItem(tokenkey)
    return this.HttpCliente.get<IProjeto[]>(api.concat(`/projeto/${board}`), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }
}
