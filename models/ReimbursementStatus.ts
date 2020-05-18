// The ReimbursementStatus model is used to track the status of reimbursements. Status possibilities are `Pending`, `Approved`, or `Denied`.
export default class ReimbursementStatus {
  statusId: number; // primary key
  status: string; // not null, unique
  constructor(statusId: number, status: string) {
    statusId = this.statusId; 
    status = this.status; 
  }
}