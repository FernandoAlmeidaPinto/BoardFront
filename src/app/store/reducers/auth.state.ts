import { createReducer, on } from "@ngrx/store"
import { loginAction } from "../actions/authActions/actions"

export interface UserTypeState {
  _id: number,
  email: string,
  nome: string,
  sobrenome: string,
  cargo: {
    _id: number,
    nome: string,
  },
  time: {
    _id: number,
    nome: string,
  },
  area: {
    _id: number,
    nome: string,
  }
}

export interface UserType {
  user: UserTypeState,
  token: string
}

export const authInitialState: UserTypeState = {
  _id: 0,
  email: '',
  nome: '',
  sobrenome: '',
  cargo: {
    _id: 0,
    nome: '',
  },
  time: {
    _id: 0,
    nome: '',
  },
  area: {
    _id: 0,
    nome: '',
  }
}

export const authReducer = createReducer(
  authInitialState, 
  on(loginAction, (state, props) => state = props)
  )