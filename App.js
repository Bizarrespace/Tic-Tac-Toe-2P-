import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import Board from './components/Board';
import GameControls from './components/GameControl';
import PlayerInput from './components/PlayerInput';

const App = () => {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [history, setHistory] = useState([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = (playerX, playerO) => {
    setPlayerX(playerX);
    setPlayerO(playerO);
    setGameStarted(true);
  };

  

  const handleCellPress = (index) => {
    const newCells = [...cells];
    if (newCells[index] === null) {
      newCells[index] = currentPlayer;
      setCells(newCells);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      setHistory([...history, { cells: newCells, currentPlayer}]);
      const winner = calculateWinner(newCells);
        if (winner) {
          Alert.alert(
            "Game over",
            `Player ${winner} has won!`,
            [
              { text: "OK", onPress: () => {handleReset(); 
                setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);  } }
            ],
            { cancelable: false}
          );
        } else if (Draw(newCells)) {
          Alert.alert (
            "Game over",
            "It's a draw!",
            [
              { text: "OK", onPress: () => {handleReset(); 
                setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);  } }
            ],
            { cancelable: false}
          );
          
        }
  }
    };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, history.length - 1);
      setHistory(newHistory);
      const lastState = newHistory[newHistory.length -1];
      setCells(lastState.cells);
      setCurrentPlayer(lastState.currentPlayer);
    }
  };
 
  const calculateWinner = (cells) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }; 

  const Draw = (cells) => {
    return !cells.includes(null);
  }

  const handleResign = () => {
    const winner = currentPlayer === 'X' ? 'O' : 'X';
    Alert.alert(
      "Game over",
      `Player ${winner} has won!`,
      [
        { text: "OK", onPress: () => {handleReset(); 
          setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);  } }
      ],
      { cancelable: false}
    );
  };

  if (!gameStarted) {
    return <PlayerInput onStartGame={startGame} />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${currentPlayer}`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${playerO}`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${playerX}`}</Text>
        <Board cells={cells} handleCellPress={handleCellPress} />
        <GameControls handleUndo={handleUndo} handleReset={handleReset} handleResign={handleResign} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor:'white',
  },
  currentPlayer: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
});

export default App;
