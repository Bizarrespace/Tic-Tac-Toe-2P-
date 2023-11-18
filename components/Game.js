import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text, Button } from 'react-native';
import Board from './Board';
import GameControls from './GameControl';
import PlayerInput from './PlayerInput';
import Sound from 'react-native-sound';
import DialogAndroid from 'react-native-dialogs';


const Game = ({ navigation }) => {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [history, setHistory] = useState([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [colorX, setColorX] = useState('black');
  const [colorO, setColorO] = useState('black');

  const startGame = (playerX, playerO) => {
    setPlayerX(playerX);
    setPlayerO(playerO);
    setGameStarted(true);
  };

  const handleCellPress = (index) => {
    if (cells[index] !== null) return;
    
    const newCells = [...cells];
    newCells[index] = currentPlayer;
    
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const newHistory = [...history, { cells: newCells, currentPlayer}];
    
    setCells(newCells);
    setCurrentPlayer(nextPlayer);
    setHistory(newHistory);
    
    const winner = calculateWinner(newCells);
    if (winner || Draw(newCells)) {
      playSound(winner ? 'win.wav' : 'draw.wav');
      showAlert(winner ? `Player ${winner} has won!` : "It's a draw!");
    }
  };

  const playSound = (soundFile) => {
    if (!isSoundEnabled) return;
    let sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      sound.play(() => sound.release());
    });
  };

  const showAlert = (message) => {
    Alert.alert(
      "Game over",
      message,
      [
        { 
          text: "OK", 
          onPress: () => {
            handleReset(); 
            setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
          } 
        }
      ],
      { cancelable: false}
    );
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
    playSound('win.wav')
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

  const openSettings = async () => {
    const { selectedItem } = await DialogAndroid.showPicker('Settings', null, {
      items: [
        { label: 'Sound ON', id: 'sound_on' },
        { label: 'Sound OFF', id: 'sound_off' },
        { label: 'X Color: Red', id: 'x_red' },
        { label: 'X Color: Blue', id: 'x_blue' },
        { label: 'O Color: Red', id: 'o_red' },
        { label: 'O Color: Blue', id: 'o_blue' },
      ],
    });
  
    if (selectedItem) {
      switch (selectedItem.id) {
        case 'sound_on':
          setIsSoundEnabled(true);
          break;
        case 'sound_off':
          setIsSoundEnabled(false);
          break;
        case 'x_red':
          setColorX('red');
          break;
        case 'x_blue':
          setColorX('blue');
          break;
        case 'o_red':
          setColorO('red');
          break;
        case 'o_blue':
          setColorO('blue');
          break;
      }
    }
  };

  if (!gameStarted) {
    return <PlayerInput onStartGame={startGame} />;
  } else {
    return (
      <View style={styles.container}>
        <Button title="Settings" onPress={openSettings} />
        <Button title="About" onPress={() => navigation.navigate('About')} />
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${currentPlayer}`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${playerX}`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${playerO}`}</Text>
        <Board cells={cells} handleCellPress={handleCellPress} colorX={colorX} colorO={colorO} />
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

export default Game;