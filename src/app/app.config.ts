import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './environment/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter( routes ), 
    provideAnimations(),
    provideFirebaseApp(() => initializeApp( firebaseConfig )), 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())]
};
