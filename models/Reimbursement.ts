// The Reimbursement model is used to represent a single reimbursement that an employee would submit
export default class Reimbursement {
  reimbursementId: number; // primary key
	author: number;  // foreign key -> User; not null
	amount: number;  // not null
  dateSubmitted: number; // not null
  dateResolved: number; // not null
  description: string; // not null
  resolver: number; // foreign key -> User
  status: number; // foreign ey -> ReimbursementStatus, not null
  type: number; // foreign key -> ReimbursementType
  constructor(  reimbursementId: number, author: number, amount: number, dateSubmitted: number, dateResolved: number, description: string, resolver: number, status: number, type: number) {
    reimbursementId = this.reimbursementId; 
    author = this.author; 
    amount = this.amount; 
    dateSubmitted = this.dateSubmitted; 
    dateResolved = this.dateResolved; 
    description = this.description; 
    resolver = this.resolver; 
    status = this.status; 
    type = this.type; 
  }
}