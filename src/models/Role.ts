// The Role model is used to track what permissions a user has
export class Role {
  roleId: number; // primary key
  role: string; // not null, unique
  constructor(roleId: number, role: string) {
    roleId = this.roleId;
    role = this.role;
  }
}