import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mentions2 = [
    { id: 1, userName: 'abc123', name: 'George Washington' },
    { id: 2, userName: 'xyz890', name: 'John Adams' }
  ];
}
