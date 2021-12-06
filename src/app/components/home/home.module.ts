import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonService } from 'src/app/services/json.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from 'src/app/shared/layout/layout.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    HomeRoutingModule,
    LayoutModule

  ],
  providers: [JsonService],
})
export class HomeModule { }
