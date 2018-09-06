import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mentions2 = [
    { id: 1, userName: 'abc123', name: 'George Washington', url: 'https://api.adorable.io/avatars/20/5.png' },
    { id: 2, userName: 'xyz890', name: 'John Adams', url: 'https://api.adorable.io/avatars/20/6.png' }
  ];
}
