Feature: Check in

  Background:
  Given the user Bob is active
  Given the user Alice is active

  Scenario: User sends a photo that is recognised
  Given the scenario: photo from active
  # Given Bob has not visited totara
  When the user Bob sends a recognisable photo of totara to the bot
  Then the bot messages Bob with found totara
  And the bot subsequently messages Bob with 'totara info'
  And the bot messages Alice with  'Bob has found the totara'

  Scenario: User sends a photo of a location with traps
  Given the scenario: location has traps
  Given Bob has 0 traps
  Given the location totara has 1 unbaited traps
  When the user Bob sends a recognisable photo of totara to the bot
  Then the bot sends message 1 'found totara' to Bob
  And the bot sends message 2 'totara info' to Bob 
  And the bot sends message 3 'bait trap? or pick up trap?' to Bob 
  And the bot messages Alice with 'Bob has found the totara'

  @Pending
  Scenario: User sends a photo that is recognised
  Given the scenario: location has traps
  Given the user Bob has 1 traps
  Given the location totara has 0 traps
  When the user Bob sends a recognisable photo of totara to the bot
  Then the bot messages (1) Bob with found totara
  And the bot messages (2) Bob with 'totara info'
  And the bot messages (3) Bob with 'bait trap?'
  And the bot messages (1) Alice with 'Bob has found the totara'

  @Pending
  Scenario: User sends a photo that is recognised
  Given the scenario: location has traps
  Given the user Bob has 0 traps
  Given the user Bob 's last location was totara
  Given the location totara has 1 traps
  When the user Bob sends a recognisable photo of totara to the bot
  Then the bot messages Bob with found totara
  And the bot subsequently messages Bob with 'totara info'
  And the bot messages Alice with  'Bob has found the totara'

  # Unhappy path
  #  Scenario: User sends a photo that is not recognised
  #  Given the scenario: blurry photo from active
  #  When the user Bob sends a blury photo of totara to the bot
  #  Then the bot messages Bob with 'not recognised'
  #  And the bot subsequently messages Bob with 'totara info'
  #  And the bot messages Alice with  'Bob has found the totara'
