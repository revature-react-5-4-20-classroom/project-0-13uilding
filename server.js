// ## Security
//   Security should be handled through session storage.
//   If a user does not have permission to access a particular endpoint it should return the following:
//   * **Status Code:** 401 UNAUTHORIZED <br />
//     **Content:** 
//     ```javascript
//     {
//       "message": "The incoming token has expired"
//     }
//     ```
//     Occurs if they do not have the appropriate permissions.

// ### **Login**  
// route: `/login`
// Post
// req 
  // {
  //   username: string,
  //   password: string
  // }
// req
  // User
// Error Response
  // Status Code: 400 BAD REQUEST
  // {
  //   message: "Invalid Credentials"
  // }

// ### **Find Users**
// route: `/users`
// Get
// * **Allowed Roles** `finance-manager`
// res
    // [
    //   User
    // ]

// ### **Find Users By Id**  
  // route: `/users/:id`
  // `GET`
// * **Allowed Roles** `finance-manager` or if the id provided matches the id of the current user
// res
    // [
    //   User
    // ]

// ### **Update User**  
// route: `/users`
// `PATCH`
// * **Allowed Roles** `admin`

// * **Request**
//   The userId must be presen as well as all fields to update, any field left undefined will not be updated.
//   ```javascript
//     User
//   ```

// * **Response:**
//     ```javascript
//       User
//     ```

// ### **Find Reimbursements By Status**  
// Reimbursements should be ordered by date
// * **URL**
//   `/reimbursements/status/:statusId`  
//   For a challenge you could do this instead:  
//   `/reimbursements/status/:statudId/date-submitted?start=:startDate&end=:endDate`

// * **Method:**
//   `GET`

// * **Allowed Roles** `finance-manager`

// * **Response:**
//     ```javascript
//     [
//       Reimbursement
//     ]
//     ```

// ### **Find Reimbursements By User**  
// Reimbursements should be ordered by date
// * **URL**
//   `/reimbursements/author/userId/:userId`  
//   For a challenge you could do this instead:  
//   `/reimbursements/author/userId/:userId/date-submitted?start=:startDate&end=:endDate`

// * **Method:**
//   `GET`

// * **Allowed Roles** `finance-manager` or if ther userId is the user making the request.

// * **Response:**
//     ```javascript
//     [
//       Reimbursement
//     ]
//     ```

// ### **Submit Reimbursement**  
// * **URL**
//   `/reimbursements`

// * **Method:**
//   `POST`

// * **Rquest:**
//   The reimbursementId should be 0
//   ```javascript
//   Reimbursement
//   ```

// * **Response:**
//   * **Status Code** 201 CREATED
//     ```javascript
//       Reimbursement
//     ```


// ### **Update Reimbursement**  
// * **URL**
//   `/reimbursements`

// * **Method:**
//   `PATCH`

// * **Allowed Roles** `finance-manager`

// * **Request**
//   The reimbursementId must be presen as well as all fields to update, any field left undefined will not be updated. This can be used to approve and deny.
//   ```javascript
//     Reimbursement
//   ```

// * **Response:**
//     ```javascript
//       Reimbursement
//     ```
