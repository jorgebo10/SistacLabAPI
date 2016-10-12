Feature: Attempt to create A1 docs
  As a sistac user 
  I want to create A1 docs
  So that I can asign them to existing Informes

  Scenario: A1 creation with valid data
    Given I want to create a new AUnoDoc with numeroTramite 1234
    When I trigger creation
    Then AUnoDoc with numeroTramite 1234 is created