import { Component, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact, ContactDetails, Comment, IdentifiedEntity, PageInfo } from '../model/contact';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  pageInfo: PageInfo;
  contactDetails: ContactDetails;
  contacts: Contact[] = [];
  entities: IdentifiedEntity[] = [];
  notes: string = '';
  comments: Comment[] = [];

  constructor(private contactService: ContactService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.contactService.findByName(params.contactName).subscribe((data: PageInfo) => {
          this.pageInfo = data;
          this.contacts = this.pageInfo.contacts;
          console.log(this.contacts);
        });
      }
    );
  }

  fetchContact(id: number) {
    console.log(id);
    this.contactService.find(id).subscribe((res: ContactDetails) => {
      this.contactDetails = res;
      console.log(this.contactDetails);
      this.entities = this.contactDetails.identifiedEntities;
      this.notes = this.contactDetails.notes;
      this.comments = this.contactDetails.comments;
    });
  }
  
  deletePost(id: number) {
    this.contactService.delete(id).subscribe(res => {
      this.contacts = this.contacts.filter(item => item.id !== id);
      console.log('Contact deleted successfully');
    });
  }

}
