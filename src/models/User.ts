import { Role } from "./Role";

interface IRawParams {
  [key: string]: any
}
// The User model keeps track of users information.
export class User implements IRawParams{
  [k: string]: any;
  userId: number; // primary key
	username: string; // not null; unique
	password: string; // not null
	firstName: string; // not null
	lastName: string; // not null
	email: string; // not null
	role: Role; // not null Should be Role
  constructor(userId: number, username: string, password: string, firstName: string, lastName: string, email: string, role: Role) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
  }
  //! Not sure if this is needed
  // set userId(value: number): void {
  //   this.userId = value;
  // }
  // set username(value: string): void {
  //   this.username = value;
  // }
  // set password(value: string): void {
  //   this.username = value;
  // }
  // set firstName(value: string): void {
  //   this.username = value;
  // }
  // set lastName(value: string): void {
  //   this.lastName = value;
  // }
  // set email(value: string): void {
  //   this.email = value;
  // }
  // set role(value: Role): void {
  //   this.role = value;
  // }

}