Feature: Drop

  Background:
  Given the user Alice is active

  Scenario: User baits a trap
  Given the scenario: bait
  Given Alice has 2 traps
  Given the location totara has 0 unbaited traps
  Given the user Alice has checked in at location totara  
  When the user Alice taps Drop
  Then the bot messages Alice with you have dropped a trap at totara and have 1 trap left
  And totara will have 1 baited traps
  And Alice will have 1 traps
