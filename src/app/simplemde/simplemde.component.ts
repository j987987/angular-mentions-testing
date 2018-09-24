import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Key } from 'ts-keycode-enum';
import * as CodeMirror from 'codemirror';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { map, startWith, withLatestFrom, tap, take, pairwise, filter, debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest, fromEvent } from 'rxjs';
import { Simplemde } from 'ng2-simplemde';

@Component({
  selector: 'app-simplemde',
  templateUrl: './simplemde.component.html',
  styleUrls: ['./simplemde.component.css']
})
export class SimplemdeComponent implements OnInit, AfterViewInit {

  public ctrl = new FormControl('');
  @ViewChild('mde') public mde: Simplemde | any;
  @ViewChild('help') public help;
  @ViewChild('fab') public fab;
  selectedIndex = 0;
  showMentions = false;
  showFab = false;
  public codeMirror: CodeMirror.Editor;
  rendered$;
  mentionTerm$ = new BehaviorSubject('');
  selectedText = '';
  @Input()
  data = {
    '@': [
      'bob'
    ],
    '#': [
      'jim'
    ]
  };
  @Input()
  mentions = [
    {
      id: 1,
      userName: 'MoneyTime',
      name: 'John Doe',
      url: 'https://api.adorable.io/avatars/20/1.png'
    },
    {
      id: 2,
      userName: 'superman',
      name: 'Peter Parker',
      url: 'https://api.adorable.io/avatars/20/2.png'
    },
    {
      id: 3,
      userName: 'ssMinnow',
      name: 'Sally Sanders',
      url: 'https://api.adorable.io/avatars/20/3.png'
    },
    {
      id: 4,
      userName: 'dashrimps',
      name: 'Bubba Gump',
      url: 'https://api.adorable.io/avatars/20/5.png'
    }
  ];
  mention$;

  options: SimpleMDE.Options | any = {
    previewRender(markdown, a, b, c) {
      console.log('testing', markdown, a, b, c);
      const markdown2 = this.parent.markdown(markdown);
      return markdown2.replace(/(^@\w+)|(\W)(@\w+)/g,
        (match, g1, g2, g3) => {
          if (g1) {
            return `<span class="mentionHighlight">${g1}</span>`;
          } else {
            return `${g2}<span class="mentionHighlight">${g3}</span>`;
          }
        });
    },
    spellChecker: false,
    status: false
  };

  @HostListener('document:click', ['$event']) public clickedOutside(event) {
    if (this.showMentions && !this.help.nativeElement.contains(event.target)) {
      this.showMentions = false;
    }
    if (this.showFab && !this.fab.nativeElement.contains(event.target)) {
      this.showFab = false;
    }
  }

  constructor() { }

  ngOnInit() {
    this.mention$ = this.ctrl.valueChanges
      .pipe(
        startWith(this.mentions),
        withLatestFrom(this.mentionTerm$),
        map(([_, mentionTerm]: [any, any]) => {
          return this.mentions.filter((mention) => {
            // tslint:disable-next-line:no-bitwise
            return ~mention.userName.toLowerCase().indexOf(mentionTerm.toLowerCase())
              // tslint:disable-next-line:no-bitwise
              || ~mention.name.toLowerCase().indexOf(mentionTerm.toLowerCase());
          });
        })
      );

    this.rendered$ = this.ctrl.valueChanges
      .pipe(
        startWith(this.ctrl.value),
        map(
          (md) => md.replace(/(^@\w+)|(\W)(@\w+)/g,
          (match, g1, g2, g3) => {
            if (g1) {
              return `<a href="#">${g1}</a>`;
            } else {
              return `${g2}<a href="#">${g3}</a>`;
            }
          })
        )
      );
    }

  ngAfterViewInit() {
    this.codeMirror = this.mde.simplemde.codemirror;
    fromEvent(this.mde.simplemde.codemirror, 'cursorActivity')
      .pipe(
        tap(() => this.showFab = false),
        filter((cm: any) => cm.state.markedSelection && cm.state.markedSelection.length),
        debounceTime(200),
      )
      .subscribe((cm) => {
          this.showFab = true;
          const pos = this.mde.simplemde.codemirror.cursorCoords(false);
          const left = pos.left, top = pos.bottom, below = true;
          this.fab.nativeElement.style.left = left + 'px';
          this.fab.nativeElement.style.top = (top - 33) + 'px';
        },
      );

    this.mde.simplemde.codemirror.on('keydown', (_, event: KeyboardEvent) => {
      this.showFab = false;
      // this.codeMirror = cm;
      const doc = this.codeMirror.getDoc();
      const cursor = doc.getCursor();
      const wordAtCursor = this.getWordAtCursor(cursor);
      // console.log(bleh);
      // console.log('~~~~', this.mde.simplemde.codemirror.getTokenAt({line: bleh.line, ch: bleh.ch - 1}));
      // console.log('~~~~', cm.getLineTokens(bleh.line));
      // console.log('~~~~', this.mde.simplemde.codemirror.getLine(bleh.line));
      // console.log('~~~~', this.mde.simplemde.codemirror.getLine(bleh.line + 1));

      if (!this.showMentions) {
        if (event.keyCode === Key.AtSign) {
          this.mentionTerm$.next('');
          this.showMentions = true;
          this.selectedIndex = 0;
          const pos = this.mde.simplemde.codemirror.cursorCoords();
          const left = pos.left + 10, top = pos.bottom, below = true;
          this.help.nativeElement.style.left = left + 'px';
          this.help.nativeElement.style.top = top + 'px';
        }
      } else {
        switch (event.keyCode) {
          case Key.UpArrow:
            if (this.selectedIndex > 0) {
              this.selectedIndex--;
            }
            event.preventDefault();
            break;
          case Key.DownArrow:
            if (this.selectedIndex + 1 < this.mentions.length) {
              this.selectedIndex++;
            }
            event.preventDefault();
            break;
          case Key.Escape:
          // case Key.Space:
            this.showMentions = false;
            break;
          case Key.Backspace:
            if (this.ctrl.value.endsWith('@')) {
              this.showMentions = false;
            }
            this.mentionTerm$.next(this.mentionTerm$.value.slice(0, -1));
            break;
          case Key.Enter:
            this.addMention();
            break;
          default:
            if (event.keyCode >= 33 && event.keyCode <= 126) {
              this.mentionTerm$.next(this.mentionTerm$.value.concat(event.key));
            }
            console.log();
            this.selectedIndex = 0;
        }
      }

    });
  }

  setSelectedText() {
    const doc = this.codeMirror.getDoc();
    this.selectedText = doc.getSelection();
    this.showFab = false;
    doc.setSelection({ line: 0, ch: 0 }, { line: 0, ch: 0 });
  }

  addMention() {
    const doc = this.codeMirror.getDoc();
    const cursor = doc.getCursor();

    const pos = {
      line: cursor.line,
      ch: cursor.ch
    };

    if (this.mentionTerm$.value && this.mentionTerm$.value.length) {
      pos.ch = pos.ch - this.mentionTerm$.value.length;
      doc.replaceRange('', pos, { line: pos.line, ch: pos.ch + this.mentionTerm$.value.length });
    }

    this.mention$
      .pipe(take(1))
      .subscribe(
        (mentions) => {
          if (mentions[this.selectedIndex]) {
            console.log('###mentions', mentions, this.selectedIndex);
            const newMention = `${mentions[this.selectedIndex].userName} `;

            doc.replaceRange(newMention, pos);
            this.showMentions = false;

            requestAnimationFrame(() => {
              this.codeMirror.focus();
              doc.setCursor(pos.line, pos.ch + newMention.length);
              doc.markText(
                { line: pos.line, ch: pos.ch - 1 },
                { line: pos.line, ch: pos.ch + newMention.length - 1 },
                { className: 'mentionHighlight' }
              );
            });

            this.showMentions = false;
          }
        }
      );
  }

  getWordAtCursor(cursor: CodeMirror.Position): { before: string, after: string } {
    const lineTokens = this.codeMirror.getLineTokens(cursor.line);
    let before = '';
    let after = '';
    if (cursor.ch) {
      const head = cursor.ch - 1;
      let i = head;
      while (i >= 0) {
        const tokenString = lineTokens[i].string;
        if (tokenString.match(/\s/)) {
          break;
        }
        before = tokenString + before;
        i--;
      }

      let j = head + 1;
      while (j < lineTokens.length) {
        const tokenString = lineTokens[j].string;
        if (tokenString.match(/\s/)) {
          break;
        }
        after = after + tokenString;
        j++;
      }
      console.log('----', i + 1, '---', j - 1, '----', cursor.ch);
      console.log('----', lineTokens[i + 1].string, '---', lineTokens[j - 1].string);
    }
    console.log('####', lineTokens);
    console.log('~~~~', before, '$$$$', after);
    return { before, after };
  }
  // getWordAtCursor(cursor: CodeMirror.Position): { word: string, valid: boolean } {
  //   const lineTokens = this.codeMirror.getLineTokens(cursor.line);
  //   let word = '';
  //   let valid = false;
  //   if (cursor.ch) {
  //     const head = cursor.ch - 1;
  //     let i = head;
  //     while (i >= 0) {
  //       const tokenString = lineTokens[i].string;
  //       if (tokenString.match(/\s/)) {
  //         break;
  //       }
  //       word = tokenString + word;
  //       if (tokenString.match(/@/)) {
  //         if (i === 0 || lineTokens[i - 1].string.match(/\s/)) {
  //           valid = true;
  //         }
  //         break;
  //       }
  //       i--;
  //     }
  //   }
  //   console.log('~~~~', word, '$$$$', valid);
  //   return { word, valid };
  // }

}
