import { Contact } from "./contact";

export class User extends Contact{

    password: string = '';

    constructor( data?: {firstname: string, lastname: string, email: string, tel:string, password: string}) {
            super();
            if (data) {
                this.firstname = data.firstname;
                this.lastname = data.lastname;
                this.email = data.email;
                this.tel = data.tel;
                this.password = data.password;
            }
        }
}
