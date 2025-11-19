import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
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
import { LoginComponent } from './login/login.component';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';


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
    SignUpComponent,
    LoginComponent,
    CommonModule
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  private auth: AuthService = inject(AuthService);

  protected readonly SectionType = SectionType;
  protected prevSection: SectionType = SectionType.SUMMARY;
  protected currentSection: SectionType = SectionType.LOGIN;
  protected currentUser: User | null = null;

  guestLoginMain: boolean = false;
  isVisibleLoginLogo: boolean = true;

  private animationReady: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.loadUser();
  }

  // #region Methods
  // #region Sectionns
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
   * Changes the ready state for animation.
   * @param ready - true, if ready.
   */
  protected animationState(ready: boolean) {
    this.animationReady.set(ready);
  }

  /** Waits for animation. */
  private async waitForAnimation(): Promise<boolean> {
    return new Promise(resolve => {
      const ref = effect(() => {
        if (this.animationReady()) {
          resolve(true);
          ref.destroy()
        }
      });
    });
  }
  // #endregion

  // #region User
  /**
   * Sets current user.
   * @param user - User or null for current user.
   */
  protected setUser(user: User | null) {
    if (!user) localStorage.clear();
    this.currentUser = user;
  }

  /** Loads the current user, if he has logged in before. */
  protected async loadUser(): Promise<void> {
    const uid = localStorage.getItem('uid');
    let aniReady: boolean = false;
    if (uid) {
      const result: [boolean, User | null] = await this.handleLoading(uid);
      aniReady = result[0];
      this.currentUser = result[1];
      if (this.currentUser) {
        this.currentSection = SectionType.SUMMARY;
      } else {
        this.currentUser = null;
      }
    } else aniReady = await this.waitForAnimation();
    if (aniReady) this.isVisibleLoginLogo = false;
  }

  /**
   * Starts request for animattion and user.
   * @param uid - Id of user
   * @returns Ready state and instance of user or null.
   */
  private async handleLoading(uid: string): Promise<[boolean, User | null]> {
    const promAni: Promise<boolean> = this.waitForAnimation();
    const promUser: Promise<User | null> = this.auth.getUser(uid);

    return await Promise.all([promAni, promUser])
  }

  setGuestLogin(status: boolean) {
    this.guestLoginMain = status;
  }
  // #endregion
  // #endregion
}