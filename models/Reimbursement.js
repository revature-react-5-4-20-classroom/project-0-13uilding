// The Reimbursement model is used to represent a single reimbursement that an employee would submit
class Reimbursement {
  constructor(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type) {
    reimbursementId = this.reimbursementId; // number, // primary key
    author = this.author; // number,  // foreign key -> User, not null
    amount = this.amount; // number,  // not null
    dateSubmitted = this.dateSubmitted; // number, // not null
    dateResolved = this.dateResolved; // number, // not null
    description = this.description; // string, // not null
    resolver = this.resolver; // number, // foreign key -> User
    status = this.status; // number, // foreign ey -> ReimbursementStatus, not null
    type = this.type; // number // foreign key -> ReimbursementType
  }
}