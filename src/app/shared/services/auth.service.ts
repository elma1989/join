import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, UserCredential } from '@angular/fire/auth';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);

  /**
   * Registers a user.
   * @param email - E-Mail of user.
   * @param password Password of user.
   * @returns User-Credential as Observable
   */
  async register(user: User): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    user.id = cred.user.uid;
    return cred;
  }
}
