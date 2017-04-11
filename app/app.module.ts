import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// external modules
import { SqueezeBoxModule } from './squeezebox/index';
// import { TableModule } from './table/index';

// root
import { AppComponent } from './app.component';

// custom components
import { ECModalComponent } from './ec-modal.component';
import { PullTopDrawerComponent } from './pull-top-drawer.component';
import { ContentItemComponent } from './contentitem.component';
import { QuestionableComponent, QuestionableDialogComponent } from './questionable.component';

// external components

// pipes
import { ContentItemFilterPipe } from './contentitemfilter.pipe';
import { SafeUrlPipe } from './safeurl.pipe';

@NgModule({
  imports:      [ CommonModule, BrowserModule, FormsModule, HttpModule, MaterialModule, MaterialModule.forRoot(), BrowserAnimationsModule, SqueezeBoxModule, /*TableModule*/ ],
  declarations: [ AppComponent, ECModalComponent, PullTopDrawerComponent, ContentItemComponent, QuestionableComponent, QuestionableDialogComponent, ContentItemFilterPipe, SafeUrlPipe ],
  entryComponents: [ QuestionableDialogComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }