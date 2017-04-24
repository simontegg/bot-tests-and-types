Feature: Bait

  Background:
  Given the user Bob is active
  Given the user Alice is active

  Scenario: User baits a trap
  Given the scenario: bait
  Given Bob has 0 traps
  Given the location totara has 1 unbaited traps
  Given the user Bob has checked in at location totara  
  When the user Bob taps Bait
  Then the bot messages Bob with you have baited the trap at totara
  And totara will have 1 baited traps
