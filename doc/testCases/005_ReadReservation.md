## Test Case 005 Read Reservation v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

User views the details of an existing reservation.

### Preconditions

* User is logged in
* At least one booked reservation is available

### Test Data

* Reservation Route: `Hirtshals → Lavrik`
* Ferry Name: `Herminia`

### Execution Steps

1. User navigates to `My Bookings`
2. User selects a reservation
3. User clicks `View Details`

### Expected Result

* Detailed view opens showing all reservation information
* Includes ferry name, date, time, vehicle size, and duration

### Actual Result

* Full reservation details are shown accurately
* UI displays correct format and data

### Evaluation

1. Data matches booking summary
2. Layout is clear and accessible
3. No missing or incorrect fields

### Overall Evaluation

Passed

### Postconditions

User is still logged in and can proceed with other actions like edit or delete.
