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
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "join-6c719", appId: "1:576560983875:web:f179ad1718b2e48709c9f6", storageBucket: "join-6c719.firebasestorage.app", apiKey: "AIzaSyDP5Odb2B6cUv6N0GzSyXV5lN6JKE9DHxg", authDomain: "join-6c719.firebaseapp.com", messagingSenderId: "576560983875", measurementId: "G-YRD88CLEWR", projectNumber: "576560983875", version: "2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
