import { RegisterModule } from './pages/register/register.module';
import { LoginModule } from './pages/login/login.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MetaReducer } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http'
import { authReducer } from './store/reducers/auth.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { hydrationMetaReducer } from './store/reducers/hydration.reducer';
import { FormsModule } from '@angular/forms';

export const metaReducers: MetaReducer[] = [hydrationMetaReducer]
const reducer = {
  auth: authReducer
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    RegisterModule,
    StoreModule.forRoot(reducer, {metaReducers}),
    HttpClientModule,
    StoreDevtoolsModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    
  ]
})
export class AppModule { }
