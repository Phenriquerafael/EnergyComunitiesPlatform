# Defintion of Done (DoD)
Before an issue is set as Done, it must comply with the criteria defined in this DoD, ensuring that the work related to the issue is completed, tested and meets all the requirements. 
*NOTE: This DoD only applies to issues that represent functionalities and/or user-stories.*

## Code Readiness
- Code is complete and reviewed
- Feature branch is merged into the dev branch

## Testing
- All tests, unit, integration and E2E are passing
- Integration tests, with and without isolation were done by someone else other than the assigned issue developer

## Requirement compliance
- All acceptance criteria are met

## Branch management
- Issues must be functionally tested locally before merging feature branch into dev branch, making sure to merge the dev branch into the feature branch before testing
- After mergine the feature branch into the dev branch, the feature branch must be deleted
