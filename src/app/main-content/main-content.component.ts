import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { AsideComponent } from "./aside/aside.component";
import { ContactsComponent } from './contacts/contacts.component';
import { SectionType } from '../shared/enums/section-type';
import { BoardComponent } from './board/board.component';
import { AddTaskContainerComponent } from "./add-task-container/add-task-container.component";
import { PrivacyPolicyComponent } from '../main-content/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from '../main-content/legal-notice/legal-notice.component';
import { SummmaryComponent } from './summmary/summmary.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { User } from '../shared/classes/user';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    AsideComponent,
    ContactsComponent,
    BoardComponent,
    AddTaskContainerComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    SummmaryComponent,
    SignUpComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  protected readonly SectionType = SectionType;
  protected prevSection: SectionType = SectionType.PRIVACY;
  protected currentSection: SectionType = SectionType.SUMMARY;
  protected currentUser: User | null = null;

  /**
   * Changes the section
   * @param section Section for change.
   */
  protected changeSection(section: SectionType) {
    this.currentSection = section;
  }

  protected changePrevSection(section: SectionType) {
    this.prevSection = section;
  }

  /**
   * Sets current user.
   * @param user - User or null for current user.
   */
  protected setUser(user : User | null) {
    this.currentUser = user;
  }
}