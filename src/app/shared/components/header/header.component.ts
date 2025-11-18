import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, input, InputSignal, output, Output, OutputEmitterRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SectionType } from '../../enums/section-type';
import { User } from '../../classes/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
 //#region Outputs and Services

  user: InputSignal<User | null> = input<User | null>(null);
  /** Emits the currently selected section (e.g., Legal, Privacy). */
  selectedSection: OutputEmitterRef<SectionType> = output<SectionType>();
  userLogout: OutputEmitterRef<null> = output<null>();

  
  /** Service used to manage modals (e.g., Help modal). */
  protected modalService = inject(ModalService);
  private auth: AuthService = inject(AuthService);

  //#endregion

  //#region State

  /** Determines whether the profile menu is currently visible. */
  isMenuVisible = false;

  get letters(): string {
    const user = this.user();
    if (user) return `${user.firstname[0]}${user.lastname[0]}`
    return 'G'
  }
  //#endregion

  //#region Menu Control Methods

  /**
   * Toggles the visibility of the profile menu.
   */
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  /**
   * Closes the menu and performs logout actions.
   * In a full implementation, authentication services would handle this logic.
   */
  async logout(): Promise<void> {
    await this.auth.logout()
    this.userLogout.emit(null);
    this.selectedSection.emit(SectionType.LOGIN);
    this.closeMenu();
  }

  /**
   * Closes the profile menu.
   */
  closeMenu(): void {
    this.isMenuVisible = false;
  }

  //#endregion

  //#region Section Navigation Methods

  /**
   * Opens the Privacy Policy section and closes the menu.
   */
  openPrivacy(): void {
    this.selectedSection.emit(SectionType.PRIVACY);
    this.closeMenu();
  }

  /**
   * Opens the Legal Notice section and closes the menu.
   */
  openLegal(): void {
    this.selectedSection.emit(SectionType.LEGAL);
    this.closeMenu();
  }

  /**
   * Closes the menu and opens the Help modal window.
   */
  openHelpFromMenu(): void {
    this.closeMenu();
    this.modalService.openHelpModal();
  }

  //#endregion

  //#region Event Listeners

  /**
   * Detects clicks outside the profile container and closes the menu if necessary.
   * @param event The DOM click event
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.closeMenu();
    }
  }

  //#endregion
}