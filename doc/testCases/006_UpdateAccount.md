## Test Case 006 Update Account v1.0

Change Date: 03.06.2025
Author: Leandro Aepli

Execution Date: 03.06.2025
Executed by: Leandro Aepli

### Description

User updates personal account details.

### Preconditions

* User is logged in
* Account settings are accessible from the menu

### Test Data

* New Phone Number: `+41 555 123 45`
* New Street: `Neudorfstrasse`
* New House nr.: `22`

### Execution Steps

1. User clicks on the `Settings` icon
2. User accesses account information
3. User updates desired fields
4. User clicks `Save Changes`

### Expected Result

* Account information is updated
* A success message is displayed
* New details persist after reload

### Actual Result

* New data saved and shown
* Confirmation feedback received
* Reload reflects changes

### Evaluation

1. Inputs accepted
2. Data saved successfully
3. UI behaves correctly

### Overall Evaluation

Passed

### Postconditions

User’s profile now reflects the updated information.