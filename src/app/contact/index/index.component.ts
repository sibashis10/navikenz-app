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
  contacts: Contact[] = [];
  currentContact?: ContactDetails;
  entities: IdentifiedEntity[] = [];
  notes: string = '';
  comments: Comment[] = [];
  currentIndex = -1;

  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 40, 50];

  constructor(private contactService: ContactService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.retrieveContacts();
  }

  getRequestParams(searchText: string, page: number, pageSize: number): any {
    let params: any = {};
    if (searchText) {
      params[`searchText`] = searchText;
    }
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }

  retrieveContacts(): void {
    this.route.queryParams.subscribe(params => {
      const paramsObj = this.getRequestParams(params.contactName, params.page, params.size);
      this.contactService.findByName(paramsObj).subscribe((response: PageInfo) => {
        this.pageInfo = response;
        this.contacts = this.pageInfo.contacts;
        console.log(this.contacts);
        this.count = this.pageInfo.totalItems;
      },
      error => {
        console.log(error);
      });
    });
  }

  fetchContact(id: number) {
    console.log(id);
    this.contactService.find(id).subscribe((res: ContactDetails) => {
      this.currentContact = res;
      console.log(this.currentContact);
      this.entities = this.currentContact.identifiedEntities;
      this.notes = this.currentContact.notes;
      this.comments = this.currentContact.comments;
    });
  }
  
  deletePost(id: number) {
    this.contactService.delete(id).subscribe(res => {
      this.contacts = this.contacts.filter(item => item.id !== id);
      console.log('Contact deleted successfully');
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveContacts();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveContacts();
  }

}
