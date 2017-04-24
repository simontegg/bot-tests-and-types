Feature: Pickup

  Background:
  Given the user Alice is active

  Scenario: User picks up a trap
  Given the scenario: pickup
  Given Alice has 0 traps
  Given the location totara has 1 unbaited traps
  Given the user Alice has checked in at location totara  
  When the user Alice taps Pickup
  Then the bot messages Alice with you have picked up a trap from totara and have 1 trap
  And the location totara will have 0 traps
  And Alice will have 1 traps
