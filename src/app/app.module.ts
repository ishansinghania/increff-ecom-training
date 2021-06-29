import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoginModule } from '@libs/login/login.module';
import { MiscellaneousModule } from '@libs/miscellaneous/miscellaneous.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MiscellaneousModule,
    LoginModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
