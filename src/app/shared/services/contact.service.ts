import { inject, Injectable, OnDestroy } from '@angular/core';
import { FireContactService } from './fire-contact.service';
import { Contact } from '../classes/contact';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ContactGroup } from '../classes/contactGroup';
import { DisplaySizeService, DisplayType } from './display-size.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy {

  // #region properties

  private fcs : FireContactService = inject(FireContactService);
  private dss: DisplaySizeService = inject(DisplaySizeService);

  // add or edit contact modal properties 

  private isEditModalOpenBS: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isEditModalOpen: Observable<boolean> = this.isEditModalOpenBS.asObservable();
  private isAddModalOpenBS: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAddModalOpen: Observable<boolean> = this.isAddModalOpenBS.asObservable();
  private modalHeadlineTxtBS: BehaviorSubject<string> = new BehaviorSubject('Add');
  modalHeadlineTxt: Observable<string> = this.modalHeadlineTxtBS.asObservable();
  private modalSaveBtnTxtBS: BehaviorSubject<string> = new BehaviorSubject('Create contact ✓');
  modalSaveBtnTxt: Observable<string> = this.modalSaveBtnTxtBS.asObservable();

  //  contact-detail

  private classToDisplayBS: BehaviorSubject<string> = new BehaviorSubject('');
  classToDisplay$: Observable<string> = this.classToDisplayBS.asObservable();

  curSize$ : Subscription;

  // fireContactService integration properties

  contactsBS: BehaviorSubject<Array<Contact>> = new BehaviorSubject(new Array<Contact>());
  contacts: Observable<Array<Contact>> = this.contactsBS.asObservable();
  contacts$ : Subscription = this.fcs.contacts$.subscribe((contactStream: Array<Contact>) => {
    this.contactsBS.next(contactStream.sort());
  });

  contactToEditBS: BehaviorSubject<Contact> = new BehaviorSubject(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
  contactToEdit: Observable<Contact> = this.contactToEditBS.asObservable();  
  
  private currentContactBS: BehaviorSubject<Contact | null > = new BehaviorSubject<Contact | null>(null);;
  currentContact$: Observable<Contact | null> = this.currentContactBS.asObservable();

  contactGroupsBS: BehaviorSubject<Array<string>> = new BehaviorSubject(new Array<string>());
  contactGroups: Observable<Array<string>> = this.contactGroupsBS.asObservable();
  contactGroups$ = this.fcs.getAllGroups$().subscribe((groups: Array<string>) => {
    this.contactGroupsBS.next(groups);
  });

  contactsByGroupBS: BehaviorSubject<Array<ContactGroup>> = new BehaviorSubject(new Array<ContactGroup>());
  contactsByGroup: Observable<Array<ContactGroup>> = this.contactsByGroupBS.asObservable();

  // #endregion properties

  constructor() { 
    this.contactsByGroup = this.fcs.getContactGroups();
    this.curSize$ = this.subscribeWindowSize();
  }

  ngOnDestroy(): void {
    this.contacts$.unsubscribe();
    this.contactGroups$.unsubscribe();
    this.curSize$.unsubscribe();
  }

  // #region methods

  // detail methods

  subscribeWindowSize () {
    return this.dss.size().subscribe((size) => {
      console.log(size);
      if(size = DisplayType.NOTEBOOK) {
        this.classToDisplayBS.next('d_none');
      }
      else if(size == DisplayType.DESKTOP) {
        this.classToDisplayBS.next('');
      }
    })
  }

  // modal methods

  openModal(kindOfModal: string) {
    if(kindOfModal == 'add') {
      this.contactToEditBS.next(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
      this.isEditModalOpenBS.next(false);
      this.isAddModalOpenBS.next(true);
      this.modalHeadlineTxtBS.next('Add');
      this.modalSaveBtnTxtBS.next('Create contact ✓');

    } else if (kindOfModal == 'edit') {
      this.isEditModalOpenBS.next(true);
      this.isAddModalOpenBS.next(false);
      this.modalHeadlineTxtBS.next('Edit');
      this.modalSaveBtnTxtBS.next('Save');
    }
  }

  closeModal() {
    this.isEditModalOpenBS.next(false);
    this.isAddModalOpenBS.next(false);
    this.modalHeadlineTxtBS.next('Add');
    this.modalSaveBtnTxtBS.next('Create contact ✓');
  }

  // contact list methods

  selectContact(contact:Contact|null = null) {
    this.currentContactBS.next(contact);
  }

  async setActiveContact(id: string) {
    await this.contacts.forEach((contactStream) => {
      contactStream.forEach((contact) => {
        contact.selected = false;
        if(contact.id == id) {
          contact.selected = true;
          this.contactToEditBS.next(contact);
          this.selectContact(contact);
          this.classToDisplayBS.next('');
        }
      });
    });
  }

  unselectCurrentContact(id: string) {
    this.contacts.forEach((contactStream) => {
      contactStream.forEach((contact) => {
        if(contact.id == id) {
          contact.selected = false;
        }
      })
    })
  }

  // Detail methods

  setDetailVisibility(classname: string) {
    this.classToDisplayBS.next(classname);
    if(this.currentContactBS.value) {
      this.unselectCurrentContact(this.currentContactBS.value.id);
      this.currentContactBS.next(null);
    }
  }

  // #region CRUD methods

  async addContactToDB(contact: Contact) {
    await this.fcs.addContact(contact);
  }

  async updateContactInDB(contact: Contact) {
    await this.fcs.updateContact(contact);
  }

  async deleteContactInDB(contact: Contact) {
    await this.fcs.deleteContact(contact);
  }

  // #endregion CRUD methods
  // #endregion methods
}
