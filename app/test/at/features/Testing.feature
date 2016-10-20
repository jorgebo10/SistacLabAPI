Feature: A1 creation

  Scenario: Succesful A1 creation when it does not exist by numeroTramite and cit
    Given I want to create a new AUnoDoc with numeroTramite 4444 and cit 4444
    When I trigger creation
    Then AUnoDoc with numeroTramite 86746 is created