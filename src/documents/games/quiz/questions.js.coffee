_ = require 'underscore'

class Answer
  constructor: (@text, @isCorrect=false, @isSelected=false, @isDisabled=false) ->

class Question
  constructor: (@text, correctAnswer, incorrectAnswers...) ->
    @answers = (new Answer(answer) for answer in incorrectAnswers)
    @answers.push(new Answer(correctAnswer, true))
    @answers = _.shuffle(@answers)

questionData = {
  inventionsBook1: [
    [
      "Where would you be most likely to find Professor P's phone?"
      "In Sleepy's basket"
      "On the hall table"
      "In the living room"
    ]
    [
      "What is the best way to find Professor P's phone?"
      "Call out and ask it where it is"
      "Ask Sleepy to go and fetch it"
      "Wait for it to ring"
    ]
    [
      "Which of Professor P's inventions is polite and helpful?"
      "His phone"
      "His fridge"
      "His dishwasher"
    ]
    [
      "Professor P's fridge is"
      "Grumpy"
      "Helpful"
      "Funny"
    ]
    [
      "What is the best way to open Professor P's fridge?"
      "Ask it nicely"
      "Yank the handle hard"
      "Prise it open with a screwdriver"
    ]
    [
      "Which of Professor P's inventions is bad tempered?"
      "His fridge"
      "His toaster"
      "His washing machine"
    ]
    [
      "Professor P's toaster"
      "Tells jokes"
      "Explodes!"
      "Hates mornings"
    ]
    [
      "Professor P's toaster"
      "Sometimes burns toast"
      "Never burns toast"
      "Always burns toast"
    ]
    [
      "Which of Professor P's inventions tells jokes?"
      "His toaster"
      "His fridge"
      "His dishwasher"
    ]
    [
      "Which of Professor P's inventions doesn't know when to stop talking?"
      "His toaster"
      "His phone"
      "His washing machine"
    ]
    [
      "Professor P's front door"
      "Talks in a loud commanding voice"
      "Often bursts into fits of giggles"
      "Laughs loudly"
    ]
    [
      "Which of Professor P's inventions talks in a loud commanding voice?"
      "His front door"
      "His phone"
      "His watch"
    ]
    [
      "What's unusual about Professor P's cans of self-heating beans?"
      "They sometimes explode"
      "They always explode"
      "They don't heat up the beans"
    ]
    [
      "Which of Professor P's inventions is most likely to explode"
      "His can of self-heating beans"
      "His toaster"
      "His phone"
    ]
    [
      "What is unusual about Professor P dishwasher"
      "Nothing, it's just an ordinary dishwasher"
      "It also washes clothes"
      "It often breaks the dishes"
    ]
    [
      "Which of Professor P's inventions does not talk?"
      "His dishwasher"
      "His phone"
      "His watch"
    ]
    [
      "What colour is Professor P's watch?"
      "Purple"
      "Pink"
      "Blue"
    ]
    [
      "What is unusual about Professor P's watch?"
      "It reminds him of appointments"
      "It often gets the time wrong"
      "It keeps falling off his wrist"
    ]
    [
      "What is the problem with Professor P's automatic dog bathing machine?"
      "It pulled some hairs out of Sleepy"
      "It doesn't get Sleepy clean"
      "Nothing, it works fine"
    ]
    [
      "What is the problem with Professor P's electric flea comb?"
      "It gave Sleepy an electric shock"
      "It doesn't kill fleas"
      "Nothing, it works fine"
    ]
    [
      "What is the problem with Professor P's automatic pet feeder?"
      "Nothing, it works fine"
      "It gave Professor P's cats an electric shock"
      "It explodes"
    ]
    [
      "Which of Professor P's pet products works very well?"
      "The automatic pet feeder"
      "The automatic dog bathing machine"
      "The electric flea comb"
    ]
    [
      "What's special about Professor P's solar powered kettle?"
      "It can use sea water"
      "It tells jokes"
      "It explodes"
    ]
    [
      "What's special about Professor P's dinghy?"
      "It's solar powered and self-inflating"
      "Nothing, it's just an ordinary dinghy"
      "It explodes"
    ]
    [
      "The metal detector Peter and Tara built"
      "Blew up"
      "Worked fine"
      "Did not have enough capacitors"
    ]
    [
      "What is unusual about the lights in Professor P's basement?"
      "They won't switch on unless you say \"please\""
      "They switch on automatically"
      "They don't work"
    ]
    [
      "What is the problem with Professor P's solar powered cool box?"
      "There's no room for the food"
      "It freezes the food"
      "It explodes"
    ]
    [
      "What is unusual about the coloured balls in Professor P's basement?"
      "They don't stop bouncing"
      "They explode"
      "Nothing, they are just ordinary plastic balls"
    ]
    [
      "What is unusual about the Professor P's answer phone?"
      "It won't let you talk to Professor P if you're trying to sell something"
      "It doesn't record messages"
      "It explodes"
    ]
    [
      "What is unusual about the Professor P's answer phone?"
      "It sings badly"
      "Nothing, it works fine"
      "It explodes"
    ]
  ]

  dinosaurs: [
    [
      "Test dinosaur question"
      "Answer 1"
      "Answer 2"
      "Answer 3"
    ]
  ]
}

module.exports = (category, numQuestions) ->
  unformattedQuestions = _.sample(questionData[category], numQuestions)
  for question in unformattedQuestions
    new Question(question...)
