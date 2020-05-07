// The ReimbursementType model is used to track what kind of reimbursement is being submitted. Type possibilities are `Lodging`, `Travel`, `Food`, or `Other`.
class ReimbursementType {
  constructor(typeId, type) {
    typeId = this.typeId; // number, // primary key
    type = this.type; // string, // not null, unique
  }
}