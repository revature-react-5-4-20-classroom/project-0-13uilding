import Role from "./Role";

// The User model keeps track of users information.
export default class User {
  userId: number; // primary key
	username: string; // not null; unique
	password: string; // not null
	firstName: string; // not null
	lastName: string; // not null
	email: string; // not null
	role: Role; // not null
  constructor(userId: number, username: string, password: string, firstName: string, lastName: string, email: string, role: Role,) {
    userId = this.userId;
    username = this.username;
    password = this.password;
    firstName = this.firstName;
    lastName = this.lastName;
    email = this.email;
    role = this.role;
  }
}