---
browserify: true
---

$ = require('jquery')
MemoryGrid = require('./memorygrid')

levels = [
  { numCards: 12, cardsPerRow: 4, description: 'easy' }
  { numCards: 16, cardsPerRow: 4, description: 'medium' }
  { numCards: 20, cardsPerRow: 5, description: 'hard' }
  { numCards: 24, cardsPerRow: 6, description: 'harder' }
  { numCards: 28, cardsPerRow: 7, description: 'hardest' }
]

memoryGrid = null
currentLevel = null

levelComplete = ->
  alert("Congratulations, you completed the level in #{memoryGrid.movesTaken} moves! Select a new difficulty level from the menu to play again.")

loadLevel = (level) ->
  currentLevel = level
  $container = $('#memory-game-container')
  $container.empty()
  memoryGrid = new MemoryGrid($container, levelComplete, level.numCards, level.cardsPerRow)

$(document).ready ->
  # Add all levels to the dropdown
  $levelSelectDropdown = $('#level-select-dropdown')
  for level in levels
    $level = $("<li><a href='javascript:void(0)'>#{level.numCards} cards (#{level.description})</a></li>")
    $level.click $.proxy(loadLevel, null, level)
    $levelSelectDropdown.append $level

  # Load the first level
  loadLevel(levels[0])
