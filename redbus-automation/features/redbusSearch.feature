Feature: Search buses on redBus
  As a redBus user
  I want to search for buses between two cities
  So that I can view available buses for my journey

  Background:
    Given user launches the redBus website

  @smoke @regression @searchBus
  Scenario: Search buses from Pune to Mumbai
    When user enters "Pune" in the From location
    And user enters "Mumbai" in the To location
    And user selects a journey date
    And user clicks on the Search buses button
    Then user should see the available buses from Pune to Mumbai
