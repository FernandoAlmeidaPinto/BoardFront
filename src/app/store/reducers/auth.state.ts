import { createReducer, on } from "@ngrx/store"
import { loginAction } from "../actions/authActions/actions"

export interface UserTypeState {
  id: number,
    email: string,
    nome: string,
    sobrenome: string,
    cargo: {
      id: number,
      nome: string,
      descricao: string
    },
    time: {
      id: number,
      nome: string,
      descricao: string
    },
    area: {
      id: number,
      nome: string,
      descricao: string
  }
}

export interface UserType {
  user: UserTypeState,
  token: string
}

export const authInitialState: UserTypeState = {
  id: 0,
  email: '',
  nome: '',
  sobrenome: '',
  cargo: {
    id: 0,
    nome: '',
    descricao: ''
  },
  time: {
    id: 0,
    nome: '',
    descricao: ''
  },
  area: {
    id: 0,
    nome: '',
    descricao: ''
  }
}

export const authReducer = createReducer(
  authInitialState, 
  on(loginAction, (state, props) => state = props)
  )