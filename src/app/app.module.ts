import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { SimplemdeComponent } from './simplemde/simplemde.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillComponent } from './quill/quill.component';
import { QuillModule } from 'ngx-quill';
import { TextSelectComponent } from './text-select/text-select.component';
import { CodemirrorComponent } from './codemirror/codemirror.component';

@NgModule({
  declarations: [
    AppComponent,
    SimplemdeComponent,
    QuillComponent,
    TextSelectComponent,
    CodemirrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SimplemdeModule.forRoot(
      // {
      //   provide: SIMPLEMDE_CONFIG,
      //   // config options 1
      //   useValue: {
      //     previewRender (markdown, a, b, c) {
      //       console.log(this);
      //       console.log('testing', markdown, a, b, c);
      //       console.log();
      //       const markdown2 = this.parent.markdown(markdown);
      //       return markdown2.replace(/(^@\w+)|(\W)(@\w+)/g,
      //         (match, g1, g2, g3) => {
      //           if (g1) {
      //             return `<span class="mentionHighlight">${g1}</span>`;
      //           } else {
      //             return `${g2}<span class="mentionHighlight">${g3}</span>`;
      //           }
      //         });
      //     },
      //     spellChecker: false,
      //     status: false
      //   }
      // }
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
