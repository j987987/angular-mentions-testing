import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-text-select',
  templateUrl: './text-select.component.html',
  styleUrls: ['./text-select.component.css']
})
export class TextSelectComponent implements OnInit, AfterViewInit {

  @ViewChild('target')
  target;
  selectedText = '';
  @ViewChild('fab') public fab;
  showFab = false;
  selectionRange;
  copiedSelections: string[] = [];

  @HostListener('document:click', ['$event']) public clickedOutside(event) {
    if (this.showFab && !this.fab.nativeElement.contains(event.target)) {
      this.showFab = false;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.target.nativeElement.on('mouseup');
  }

  mouseUp(e: MouseEvent) {
    const selection: Selection = window.getSelection();
    this.selectedText = selection.toString();
    this.selectionRange = selection.getRangeAt(0);
    console.log('~Mouse event: ', e);
    console.log(selection);
    // console.log(selection.getRangeAt(0).toString());
    console.log(selection.getRangeAt(0));
    // console.log(selection.getRangeAt(0).getBoundingClientRect());
    if (this.selectedText) {
      console.log(this.target.nativeElement.innerText.indexOf(this.selectedText));
      const { left, height, top, width } = selection.getRangeAt(0).getBoundingClientRect();
      this.fab.nativeElement.style.left = left + width + window.scrollX + 'px';
      this.fab.nativeElement.style.top = `${top + window.scrollY + height / 2 - 25}px`;
      requestAnimationFrame(() => this.showFab = true);
    }
  }

  copySelection() {
    this.copiedSelections.push(this.selectedText);
  }

}
