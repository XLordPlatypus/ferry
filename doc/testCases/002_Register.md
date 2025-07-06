## Test Case 002 Register v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

New user registration.

### Preconditions

* Application is open on the browser start page

### Test Data

* First Name: `Max`
* Last Name: `Mustermann`
* Gender: `Male`
* Date of Birth: `30.06.2005`
* Phone Number: `+41 555 555 55`
* Nationality: `Switzerland`
* City: `Chur`
* Postal Code: `7000`
* Street: `Aspermontstrasse`
* House nr.: `1`
* House nr. addon: `-`
* Email: `max.mustermann@example.com`
* Password: `Root$1234`

### Execution Steps

1. User enters firstname
2. User enters lastname
3. User enters gender
4. User enters Date of birth
5. User enters phone number
6. User enters nationality
7. User enters city
8. User enters postal code
9. User enters street
10. User enters house nr.
11. User enters email
12. User enters password
13. User presses `Register` button <br>
13.1 An error pops up <br>
14.2 User fixes invalid information
14. User is logged in

### Expected Result

* User is logged in.
* View changes to a screen with a logout button and new options.

### Actual Result

* User is logged in.
* View changes to a screen with a logout button and new options.

### Evaluation


1. User enters firstname
2. User enters lastname
3. User enters gender
4. User enters Date of birth
5. User enters phone number
6. User enters nationality
7. User enters city
8. User enters postal code
9. User enters street
10. User enters house nr.
11. User enters email
12. User enters password
13. User presses `Register` button <br>
14. User is logged in


### Overall Evaluation

Passed

### Postconditions

The user can now make bookings or edit their account data.