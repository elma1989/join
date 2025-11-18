import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements AfterViewInit {

  slide = false;
  overlayActive = true;

  ngAfterViewInit() {
    // Logo schweben lassen
    setTimeout(() => {
      this.slide = true;
    }, 1500);

    // Overlay ausblenden
    setTimeout(() => {
      this.overlayActive = false;
    }, 2500);
  }
}
