import { Role } from "./Role";

export class User {
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
}