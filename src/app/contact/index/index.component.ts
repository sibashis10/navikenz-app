import { Component, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact, ContactDetails, Comment, IdentifiedEntity, PageInfo } from '../model/contact';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

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
  comments: Comment[] = [];
  currentIndex = -1;

  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 40, 50];

  constructor(private fb: FormBuilder, private contactService: ContactService, private route: ActivatedRoute) { }

  contactForm = this.fb.group({
    id: [''],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    fullName: [''],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    notes: ['', [Validators.required]]
  });

  get id() {
    return this.contactForm.get('id');
  }

  get firstName() {
    return this.contactForm.get('firstName');
  }

  get lastName() {
    return this.contactForm.get('lastName');
  }

  get fullName() {
    return this.contactForm.get('fullName');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get notes() {
    return this.contactForm.get('notes');
  }

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

  fetchContact(index: number, id: number) {
    this.currentIndex = index;
    this.contactService.find(id).subscribe((res: ContactDetails) => {
      console.log(res);
      this.currentContact = res;
      this.contactForm.setValue({
        id: this.currentContact.id,
        firstName: this.currentContact.firstName,
        lastName: this.currentContact.lastName,
        fullName: this.currentContact.fullName,
        email: this.currentContact.email,
        phone: this.currentContact.phone,
        notes: this.currentContact.notes
      });
      this.id.disable();
      this.firstName.disable();
      this.lastName.disable();
      this.fullName.disable();
      this.email.disable();
      this.phone.disable();
      this.notes.disable();
      this.entities = this.currentContact.identifiedEntities;
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

  updateFullName(): void {
    this.fullName.setValue(this.firstName.value + ' ' + this.lastName.value);    
  }

  enableFields(): void {
    this.firstName.enable();
    this.lastName.enable();
    this.email.enable();
    this.phone.enable();
    this.notes.enable();
  }

  cancelUpdatedFields(): void {
    this.contactForm.patchValue({
      firstName: this.currentContact.firstName,
      lastName: this.currentContact.lastName,
      fullName: this.currentContact.fullName,
      email: this.currentContact.email,
      phone: this.currentContact.phone,
      notes: this.currentContact.notes
    });
    this.firstName.disable();
    this.lastName.disable();
    this.email.disable();
    this.phone.disable();
    this.notes.disable();
  }

}
