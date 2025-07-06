## Test Case 001 Login v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

User logs into the application using email and password.

### Preconditions

* Application is open on the browser start page
* User already has an account from a prior registration

### Test Data

* Email: `root`
* Password: `root`

### Execution Steps

1. User clicks on the `Login` button.
2. User enters email in the upper field.
3. User enters password in the lower field.
4. User clicks the `Login` button again.
   4.1 Incorrect credentials are entered. An error message is displayed.
   4.2 User enters the correct credentials in the fields.
   4.3 User clicks the `Login` button again.
5. User is logged in.

### Expected Result

* User is logged in.
* View changes to a screen with a logout button and new options.

### Actual Result

* User is logged in.
* View changes to a screen with a logout button and new options.

### Evaluation

1. User clicks on the `Login` button.
2. User enters email in the upper field.
3. User enters password in the lower field.
4. User clicks the `Login` button.
5. User is logged in.

### Overall Evaluation

Passed

### Postconditions

The user can now make bookings or edit their account data.
