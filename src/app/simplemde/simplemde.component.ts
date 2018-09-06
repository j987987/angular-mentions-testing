import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Key } from 'ts-keycode-enum';
import CodeMirror from 'codemirror';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-simplemde',
  templateUrl: './simplemde.component.html',
  styleUrls: ['./simplemde.component.css']
})
export class SimplemdeComponent implements OnInit, AfterViewInit {

  public ctrl = new FormControl('');
  @ViewChild('mde') public mde;
  @ViewChild('help') public help;
  selectedIndex = 0;
  showMentions = false;
  public codeMirror;

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

  @HostListener('document:click', ['$event']) public clickedOutside(event) {
    if (this.showMentions && !this.help.nativeElement.contains(event.target)) {
      this.showMentions = false;
    }
  }

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.mde.simplemde.codemirror.on('keydown', (cm: any, event: KeyboardEvent) => {
      console.log('~~~~', cm);
      console.log('~~~', cm.getCursor());
      console.log('~~~', cm.getDoc());
      console.log('~~~', cm.getSelection());
      // console.log('~~~~', event);
      this.codeMirror = cm;

      if (!this.showMentions) {
        if (event.keyCode === Key.AtSign) {
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
          case Key.Space:
            this.showMentions = false;
            break;
          case Key.Backspace:
            if (this.ctrl.value.endsWith('@')) {
              this.showMentions = false;
            }
            break;
          case Key.Enter:
            this.addMention();
            break;
          default:
            this.selectedIndex = 0;
            // const pos = cm.cursorCoords();
            // const left = pos.left + 10, top = pos.bottom, below = true;
            // this.help.nativeElement.style.left = left + 'px';
            // this.help.nativeElement.style.top = top + 'px';
        }
      }

    });
  }

  addMention() {
    // this.codeMirror.replaceSelection(`${this.mentions[this.selectedIndex].userName} `);
    const doc = this.codeMirror.getDoc();
    const cursor = doc.getCursor();

    const pos = {
      line: cursor.line,
      ch: cursor.ch
    };

    doc.replaceRange(`${this.mentions[this.selectedIndex].userName} `, pos);
    this.showMentions = false;


    // const currentVal: string = this.ctrl.value;
    // this.ctrl.patchValue(currentVal.concat(`${this.mentions[this.selectedIndex].userName} `));
    // event.preventDefault();
    // this.showMentions = false;
    requestAnimationFrame(() => {
      this.codeMirror.focus();
      this.codeMirror.setCursor(pos.line, pos.ch + `${this.mentions[this.selectedIndex].userName} `.length);
    });

    this.showMentions = false;
  }

}
