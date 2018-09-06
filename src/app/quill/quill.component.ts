import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import 'quill-mention';

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.css']
})
export class QuillComponent implements OnInit {

  ctrl = new FormControl('');

  mentions = [
    { id: 1, value: 'John Doe' },
    { id: 2, value: 'Peter Parker' }
  ];

  hashTags = [
    { id: 1, value: '100' },
    { id: 2, value: 'truth' }
  ];

  modules = {
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: (searchTerm, renderList, mentionChar) => {
        if (mentionChar === '@') {
          renderList(this.mentions, searchTerm);
        } else {
          renderList(this.hashTags, searchTerm);
        }
      }
    }
  };

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.sanitizer.sanitize(SecurityContext.HTML, `<p class="para" custom-attr="3">Hello</p>`));
  }

}
