import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { SimplemdeComponent } from './simplemde/simplemde.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillComponent } from './quill/quill.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    SimplemdeComponent,
    QuillComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SimplemdeModule.forRoot(
      {
        provide: SIMPLEMDE_CONFIG,
        // config options 1
        useValue: {
          // previewRender: function (e) {
          //   console.log('testing');
          // },
          spellChecker: false,
          status: false
        }
      }
    ),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: true,
          sanitize: false,
          pedantic: false,
          smartLists: true,
          smartypants: true,
        }
      }
    }),
    QuillModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
