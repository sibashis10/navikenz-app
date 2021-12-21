import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from './contact/model/contact';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'navikenz-app';
  searchTxt: string = '';
  selectedTopic: string = 'Contact';
  topics = ['Contact', 'Pipeline', 'Documents'];

  constructor(private router: Router) { }

  search() {
    if(this.selectedTopic === 'Contact') {
      this.router.navigate(['/contact/findByName'], { queryParams: { contactName: this.searchTxt}});
    }
  }
}
