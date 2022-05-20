import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BoardComponent } from './board/board.component';
import { BoardsComponent } from './boards/boards.component';
import { ListasComponent } from 'src/app/components/listas/listas.component';
import { CardComponent } from 'src/app/components/card/card.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    BoardComponent,
    BoardsComponent,
    ListasComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule { }
