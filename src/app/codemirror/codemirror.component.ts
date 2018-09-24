import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/edit/closebrackets.js';
import { Input } from '@angular/core';

@Component({
  selector: 'app-codemirror',
  templateUrl: './codemirror.component.html',
  styleUrls: ['./codemirror.component.css']
})
export class CodemirrorComponent implements OnInit, AfterViewInit {

  @Input()
  public data = 'foo';
  @ViewChild('cm')
  public cm: ElementRef;
  public codemirror: CodeMirror.Editor;
  public langs = [
    'JSON',
    'YAML',
    'XML'
  ];

  public set selectedLang(v: string) {
    this._selectedLang = v;
    this.refreshCodeMirror();
  }

  public get selectedLang() { return this._selectedLang; }

  private _selectedLang = this.langs[0];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initCodemirror();
  }

  refreshCodeMirror() {
    if (this.codemirror) {
      const el = this.codemirror.getWrapperElement();
      el.parentNode.removeChild(el);
      this.codemirror = null;
    }
    requestAnimationFrame(() => {
      this.initCodemirror();
    });
  }

  initCodemirror() {
    switch (this.selectedLang) {
      case 'JSON':
        this.codemirror = CodeMirror(this.cm.nativeElement,
          {
            mode: { name: 'javascript', json: true },
            lineNumbers: true,
            matchBrakcets: true,
            theme: 'material'
          } as any
        );
        break;
      case 'YAML':
        this.codemirror = CodeMirror(this.cm.nativeElement,
          {
            mode: 'yaml',
            lineNumbers: true,
            theme: 'material'
          } as any
        );
        break;
      case 'XML':
        this.codemirror = CodeMirror(this.cm.nativeElement,
          {
            mode: 'xml',
            lineNumbers: true,
            theme: 'material'
          } as any
        );
        break;
    }

    this.codemirror.setValue(this.data);
    this.codemirror.on('change', () => this.data = this.codemirror.getValue());
  }
}
