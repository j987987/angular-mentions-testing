import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Key } from 'ts-keycode-enum';
import CodeMirror from 'codemirror';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { map, startWith, withLatestFrom, tap, take, pairwise, filter, debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest, fromEvent } from 'rxjs';

@Component({
  selector: 'app-simplemde',
  templateUrl: './simplemde.component.html',
  styleUrls: ['./simplemde.component.css']
})
export class SimplemdeComponent implements OnInit, AfterViewInit {

  public ctrl = new FormControl('');
  @ViewChild('mde') public mde;
  @ViewChild('help') public help;
  @ViewChild('fab') public fab;
  selectedIndex = 0;
  showMentions = false;
  showFab = false;
  public codeMirror;
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
          const pos = cm.cursorCoords(false);
          const left = pos.left, top = pos.bottom, below = true;
          this.fab.nativeElement.style.left = left + 'px';
          this.fab.nativeElement.style.top = (top - 33) + 'px';
        },
      );

    this.mde.simplemde.codemirror.on('keydown', (cm: any, event: KeyboardEvent) => {
      this.showFab = false;
      this.codeMirror = cm;

      if (!this.showMentions) {
        if (event.keyCode === Key.AtSign) {
          this.mentionTerm$.next('');
          this.showMentions = true;
          this.selectedIndex = 0;
          const pos = cm.cursorCoords();
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
    console.log('!!!!! selection range:', this.codeMirror.getCursor(true), this.codeMirror.getCursor());
    this.selectedText = this.codeMirror.getSelection();
    this.showFab = false;
    this.codeMirror.setSelection({ line: 0, ch: 0 });
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
      this.codeMirror.replaceRange('', pos, { line: pos.line, ch: pos.ch + this.mentionTerm$.value.length });
    }

    this.mention$
      .pipe(take(1))
      .subscribe(
        (mentions) => {
          console.log('###mentions', mentions, this.selectedIndex);
          const newMention = `${mentions[this.selectedIndex].userName} `;

          doc.replaceRange(newMention, pos);
          this.showMentions = false;

          requestAnimationFrame(() => {
            this.codeMirror.focus();
            this.codeMirror.setCursor(pos.line, pos.ch + newMention.length);
            this.codeMirror.markText(
              { line: pos.line, ch: pos.ch - 1 },
              { line: pos.line, ch: pos.ch + newMention.length - 1 },
              { className: 'mentionHighlight' }
            );
          });

          this.showMentions = false;
        }
      );
  }

}
