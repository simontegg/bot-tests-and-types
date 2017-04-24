Feature: Get Started

  Scenario: User starts the journey
  Given the scenario: start
  Given the user Alice has not started
  When the user Alice taps Get Started
  Then the bot messages Alice with 'Start message'

  Scenario: User has not started and interacts
  Given the scenario: inactive interaction
  Given the user Alice has not started
  When the user Alice sends the bot a message
  Then the bot messages Alice with 'Start message'

  Scenario: User arrives at park
  Given the scenario: arrive
  Given the user Alice has not started
  When the user Alice taps the quick reply Begin Journey
  Then the bot messages Alice with 'Begin message'
  And the bot sends message 2 instructions to Alice
  And the bot sends message 3 image to Alice
  And the bot has sent Alice a total of 3 messages
  And the user Alice is set to active

  Scenario: User recieves notification
  Given the scenario: start notification
  And the user Alice has not started
  And the user Bob is active
  When the user Alice taps the quick reply Begin Journey
  Then the bot messages Bob with 'Alice has begun the journey'
  And the bot has sent Bob a total of 1 messages

  Scenario: User finishes game
  Given the scenario: stop
  Given the user Alice is active
  And the user Bob is active
  When the user Alice taps Stop
  Then the bot messages Alice with 'Stop message'
  And the user Alice is set to inactive
  Then the bot messages Bob with 'Alice has left the game'

  Scenario: Game reset
  Given the scenario: reset
  Given the user Alice is active
  And no other users are active 
  And the location totara has 2 rats
  When the user Alice taps Stop
  Then the game is reset and all locations have 0 rats
