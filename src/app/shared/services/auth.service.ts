import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { User } from '../classes/user';
import { LoginData } from '../interfaces/login-data';
import { doc, DocumentReference, Firestore, getDoc } from '@angular/fire/firestore';

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

  /**
   * Gets a user from database.
   * @param id - Id of User
   * @returns Instance of User or null if not found.
   */
  async getUser(id: string): Promise<User | null> {
    const ref: DocumentReference = doc(this.fs, `contacts/${id}`);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      const user = new User();
      const data = snapshot.data();
      user.id = id;
      user.firstname = data['firstname'];
      user.group = user.firstname[0];
      user.lastname = data['lastname'];
      user.email = data['email'];
      user.tel = data['tel'];
      user.iconColor = data['iconColor'];
      return user;
    }
    return null;
  }

  /** Signs the user out. */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth)
    } catch (err) {
      console.error(err);
    }
  }
}
