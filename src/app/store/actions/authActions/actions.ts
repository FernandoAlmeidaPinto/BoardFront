import { createAction, props } from '@ngrx/store';
import { UserTypeState } from '../../reducers/auth.state';

export const loginAction = createAction(
    '[Login Page] Login',
    props<UserTypeState>()
  );