## Test Case 004 Delete Reservation v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

User cancels an existing ferry reservation.

### Preconditions

* User is logged in
* At least one reservation exists under `My Bookings`

### Test Data

* Reservation Route: `Hirtshals → Lavrik`
* Departure Date: `09.06.25, 21:34`

### Execution Steps

1. User navigates to `My Bookings`
2. User selects reservation
3. User clicks the cancel icon
4. User confirms the deletion

### Expected Result

* Reservation is marked as `Cancelled`
* A confirmation message is shown

### Actual Result

* Reservation is marked as `Cancelled`
* Confirmation message displayed

### Evaluation

1. User navigates to `My Bookings`
2. User selects reservation
3. User clicks the cancel icon
4. User confirms the deletion

### Overall Evaluation

Passed

### Postconditions

The deleted reservation is no longer accessible or listed.
