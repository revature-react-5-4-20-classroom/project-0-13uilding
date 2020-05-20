import { Role } from "./Role";

interface IRawParams {
  [key: string]: any
}
// The User model keeps track of users information.
export class User implements IRawParams{
  [k: string]: any;
  userid: number; // primary key
	username: string; // not null; unique
	password: string; // not null
	firstname: string; // not null
	lastname: string; // not null
	email: string; // not null
	role: Role; // not null Should be Role
  constructor(userid: number, username: string, password: string, firstname: string, lastname: string, email: string, role: Role) {
    this.userid = userid;
    this.username = username;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
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