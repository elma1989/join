import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  slide = false;
  overlayActive = true;
  logoVisible = true;

  ngOnInit() {
    setTimeout(() => this.slide = true, 500);
    setTimeout(() => this.overlayActive = false, 1500);
  }

  hideLogo() {
    this.overlayActive = false;
    this.logoVisible = false;
  }
}