import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: '../../main-content/start-screen/start-screen.component.html',
  styleUrls: ['../../main-content/start-screen/start-screen.component.scss'],
  animations: [
    trigger('logoAnimation', [
      state('center', style({
        transform: 'translate(-50%, -50%) scale(1)',
        top: '50%',
        left: '50%',
        opacity: 1,
      })),
      state('topLeft', style({
        transform: 'translate(0, 0) scale(0.3)',
        top: '0',
        left: '0',
        opacity: 1,
      })),
      transition('center => topLeft', [
        animate('20s ease-in-out')
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        animate('20s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WelcomeComponent implements OnInit {
  logoState = 'center';
  showLogo = true;

  ngOnInit() {
    // Nach 2 Sekunden die Animation starten
    setTimeout(() => {
      this.logoState = 'topLeft';
    }, 20000);

    // Nach 2,5 Sekunden Logo entfernen
    setTimeout(() => {
      this.showLogo = false;
    }, 25000);
  }
}
