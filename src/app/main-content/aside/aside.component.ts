import { Component, effect, inject, Input, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { SectionType } from '../../shared/enums/section-type';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../shared/services/modal.service';
import { NavItemComponent } from '../../shared/components/nav-item/nav-item.component';
import { MobileNavItemComponent } from '../../shared/components/mobile-nav-item/mobile-nav-item.component';
import { User } from '../../shared/classes/user';

/**
 * Represents a navigation item in the sidebar.
 */
export interface NavItemData {
      /** Unique section identifier */
      sectionId: string;
      /** Display title of the section */
      title: string;
      /** Path to the section icon */
      imagePath: string;
      /** Type of the section (enum) */
      section: SectionType;
      /** Indicates whether the section is currently active */
      active: boolean;
}

/**
 * Represents a legal link item (e.g., Privacy Policy or Legal Notice).
 */
export interface LegalLinks {
      /** Unique section identifier */
      sectionId: string;
      /** Display title of the legal section */
      title: string;
      /** Type of the section (enum) */
      section: SectionType;
      /** Indicates whether the section is currently active */
      active: boolean;
}

export interface MobileNavItemData {
      /** Unique section identifier */
      sectionId: string;
      /** Display title of the legal section */
      title: string;
      /** Path to the section icon */
      imagePath: string;
      /** Type of the section (enum) */
      section: SectionType;
      /** Indicates whether the section is currently active */
      active: boolean;
}

@Component({
      selector: 'aside[app-aside]',
      imports: [CommonModule, NavItemComponent, MobileNavItemComponent],
      templateUrl: './aside.component.html',
      styleUrl: './aside.component.scss'
})
export class AsideComponent {
      //#region Attributes

      guestLogin: InputSignal<boolean> = input<boolean>(false);
      /** List of main navigation items displayed in the sidebar */
      protected items: NavItemData[] = [
            {
                  sectionId: 'Summary',
                  title: 'Summary',
                  imagePath: 'assets/Icons/contact/Summary.png',
                  section: SectionType.SUMMARY,
                  active: false
            },
            {
                  sectionId: 'add-task-section',
                  title: 'Add task',
                  imagePath: 'assets/Icons/contact/addTask.png',
                  section: SectionType.TASK,
                  active: false
            },
            {
                  sectionId: 'Boards',
                  title: 'Boards',
                  imagePath: 'assets/Icons/contact/Board.png',
                  section: SectionType.BOARD,
                  active: false
            },
            {
                  sectionId: 'Contacts',
                  title: 'Contacts',
                  imagePath: 'assets/Icons/contact/Contacts.png',
                  section: SectionType.CONTACT,
                  active: false
            }
      ];

      protected item: MobileNavItemData[] = [
            {     sectionId: 'Login',
                  title: 'Login',
                  imagePath: 'assets/Icons/signon/login-arrow-icon.png',
                  section: SectionType.LOGIN,
                  active: false
            }
      ];

      /** List of legal links (Privacy Policy, Legal Notice, etc.) */
      protected itemLegal: LegalLinks[] = [
            {
                  sectionId: 'Privacy',
                  title: 'Privacy Policy',
                  section: SectionType.PRIVACY,
                  active: false
            },
            {
                  sectionId: 'Legal',
                  title: 'Legal Notice',
                  section: SectionType.LEGAL,
                  active: false
            }
      ];

      currentSection: InputSignal<SectionType> = input.required<SectionType>();
      selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();
      user: InputSignal<User | null> = input.required<User | null>();

      /** Service for handling modal dialogs */
      protected modalService: ModalService = inject(ModalService);

      //#endregion

      constructor() {
            effect(() => this.checkSection());
      }

      //#region Methods

      /**
       * Activates a main navigation item and emits the selected section.
       * @param index Index of the selected navigation item
       */
      selectSection(index: number): void {
            this.items.forEach((item, i) => {
                  item.active = i === index;
            });
            this.selectedSection.emit(this.items[index].section);
      }

      /**
       * Activates a legal navigation item and emits the selected legal section.
       * @param index Index of the selected legal item
       */
      selectLegal(index: number): void {
            this.itemLegal.forEach((item, i) => {
                  item.active = i === index;
            });
            this.selectedSection.emit(this.itemLegal[index].section);
      }

      selectLogin(index: number): void {
            this.item.forEach((item, i) => {
                  item.active = i === index;
            });
            this.selectedSection.emit(this.item[index].section);
      }

      private checkSection() {
            const section: SectionType = this.currentSection();
            this.items.forEach(item => {
                  item.active = false;
                  if (item.section == section) item.active = true;
            })
      }


      //#endregion
}
