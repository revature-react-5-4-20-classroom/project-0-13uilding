// The User model keeps track of users information.
class User {
  constructor(userId, username, password, firstName, lastName, email, role) {
    userId = this.userId; // number, // primary key
    username = this.username; // string, // not null, unique
    password = this.password; // string, // not null
    firstName = this.firstName; // string, // not null
    lastName = this.lastName; // string, // not null
    email = this.email; // string, // not null
    role = this.role; // Role // not null
  }
}