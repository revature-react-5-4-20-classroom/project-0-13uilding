// The Role model is used to track what permissions a user has
class Role {
  constructor(roleId, role) {
    roleId = this.roleId; // number, // primary key
    role = this.role; // string // not null, unique
  }
}