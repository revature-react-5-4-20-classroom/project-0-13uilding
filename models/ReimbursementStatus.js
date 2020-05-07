// The ReimbursementStatus model is used to track the status of reimbursements. Status possibilities are `Pending`, `Approved`, or `Denied`.
class ReimbursementStatus {
  constructor(statusId, status) {
    statusId = this.statusId; // number, // primary key
    status = this.status; string // not null, unique
  }
}