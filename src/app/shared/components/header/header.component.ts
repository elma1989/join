import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output, output, OutputEmitterRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SectionType } from '../../enums/section-type';

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
 //#region Outputs and Services

  /** Emits the currently selected section (e.g., Legal, Privacy). */
  @Output() selectedSection = new EventEmitter<SectionType>();

  /** Service used to manage modals (e.g., Help modal). */
  protected modalService = inject(ModalService);

  //#endregion

  //#region State

  /** Determines whether the profile menu is currently visible. */
  isMenuVisible = false;

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
  logout(): void {
    console.log('User logged out');
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