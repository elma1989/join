import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, User, UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, user => this.userSubject.next(user));
  }

  /**
   * Registers a user.
   * @param email - E-Mail of user.
   * @param password Password of user.
   * @returns User-Credential as Observable
   */
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
  }
}
