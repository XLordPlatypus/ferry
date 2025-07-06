## Test Case 003 Create Reservation v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

User creates a reservation for a ferry.

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
* Vehicle height: `< 2m`
* Vehicle Length `1 - 2 m`

### Execution Steps

1. User clicks on `Routes` or `Book` button
2. User selects route to book and clicks `Book`
3. User enters vehicle details
4. User clicks `Next`
5. User enters personal data
6. User clicks `Next`
7. User checks input and accepts terms & conditions
8. User clicks `Confirm Reservation`

### Expected Result

* Reservation is created
* Reservation is visible in `My Bookings` if logged in
* The View changes to the homepage

### Actual Result

* Reservation is created
* Reservation is visible in `My Bookings`
* The View changes to the homepage
* An Email is sent to the user (email client)


### Evaluation

1. User clicks on `Routes` or `Book` button
2. User selects route to book and clicks `Book`
3. User enters vehicle details
4. User clicks `Next`
5. User enters personal data
6. User clicks `Next`
7. User checks input and accepts terms & conditions
8. User clicks `Confirm Reservation`

### Overall Evaluation

Passed

### Postconditions

The user can look at his reservation if logged in or see the email.