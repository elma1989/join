import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { User } from '../classes/user';
import { LoginData } from '../interfaces/login-data';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private fs: Firestore = inject(Firestore)

  /**
   * Registers a user.
   * @param email - E-Mail of user.
   * @param password Password of user.
   * @returns User-Credentials.
   */
  async register(user: User): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    user.id = cred.user.uid;
    return cred;
  }

  /**
   * Signs a user in.
   * @param data - Fromdata from login.
   * @returns User-Credentials.
   */
  async login(data: LoginData): Promise<UserCredential> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, data.email, data.password);
      return cred;
    } catch (err) {
      throw err;
    }
  }
}
