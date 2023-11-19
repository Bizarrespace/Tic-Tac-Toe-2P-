# Tic-Tac-Toe-2P-
React Native Tic-Tac-Toe, with long term storage of wins

# Todo

* ~~Settings page where people can turn off sound~~
* ~~In settings choice of colors for X and O~~
* ~~Store long term W/L/D records~~
* Select existing username
  * Ability to log out too
* Let ppl see leaderboard (for all users)
* Some feature you want to add
* About page with description of the feature you created


# QDD
* Store (long-term) W/L/Draw record
  * How would you save some data like that/
    * Would have to write to a text file, and then everytime you open the game you are reading from the file again
    * How to write and read data to a file in react native?
    * Once you have the W/L data, how would you use that data to populate the win lost in the react native?
      * Think for this just read in the data into a Win lost variable
      * Would have to keep track of the player through name and associate that player with a specific win Lost
* Let ppl see leaderboard(for all users)
  * Need a way to have all users (Txt file with all user names)
* Let user Resign
  * Having a button that says resign and then the current player, once hit, the game just ends allocating the win to the other player
  * Need to have a win state first, and its a different state when it comes to which ever player it is so far
* Allow users to enter their names before playing, or select existing username
  * Need to have save with names and wins first
* PLay a sound on win
  * How to play sounds in React native?
  * Need a function that handles wins, and then at the end of this function just play a sound
* Play a sound when Draw is detected
  * Need a function that handles draws, play a sound when a draw has happened
* Include a settings page where ppl can turn off sound
  * Have an if statement that if false do not play the sound when a win or draw happens
* In settings allow choice of colors for X and O
  * How to have like a color picker?
  * How to change the color of X and O
* Some feature that you create:
  * Maybe like keeping track of win streak
* Include an about page that has your name and description of the feature you created
