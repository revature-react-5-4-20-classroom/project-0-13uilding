// The Role model is used to track what permissions a user has
export class Role {
  roleid: number; // primary key
  role: string; // not null, unique
  constructor(roleid: number, role: string) {
    this.roleid = roleid;
    this.role = role;
  }
}