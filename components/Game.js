import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, Button } from 'react-native';
import Board from './Board';
import GameControls from './GameControl';
import PlayerInput from './PlayerInput';
import Sound from 'react-native-sound';
import DialogAndroid from 'react-native-dialogs';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [gameEnded, setGameEnded] = useState(false);

  const saveRecord = async (playerName, record) => {
    try {
      await AsyncStorage.setItem(`@record_${playerName}`, JSON.stringify(record));
    } catch (e) {
      console.error(e);
    }
  }

  const loadRecord =async (playerName) => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@record_${playerName}`);
      return jsonValue != null ? JSON.parse(jsonValue) : {wins: 0, losses: 0, draws: 0};
    } catch (e) {
      console.error(e);
    }
  }

  const resetRecord = async () => {
    try {
      await AsyncStorage.clear();
      handleLogout();
    } catch (e) {
      console.error(e);
    }
  }

  const startGame = async (playerX, playerO) => {
    const recordX = await loadRecord(playerX);
    const recordO = await loadRecord(playerO);
    setPlayerX({name: playerX, record: recordX});
    setPlayerO({name: playerO, record: recordO});
    setGameStarted(true);
  };

  const handleLogout = () => {
    setGameStarted(false);
    setPlayerX('');
    setPlayerO('');
  }

  const handleCellPress = (index) => {
    if (cells[index] !== null) return;
    
    const newCells = [...cells];
    newCells[index] = currentPlayer;
    
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const newHistory = [...history, { cells: newCells, currentPlayer}];
    
    setCells(newCells);
    setCurrentPlayer(nextPlayer);
    setHistory(newHistory);
    
    const winnerSymbol = calculateWinner(newCells);
    if (winnerSymbol || Draw(newCells)) {
      playSound(winnerSymbol ? 'win.wav' : 'draw.wav');
      const winnerName = winnerSymbol === 'X' ? playerX.name : playerO.name;
      showAlert(winnerSymbol ? `Player ${winnerName} has won!` : "It's a draw!");
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

  useEffect(() => {
    if (gameEnded) {
      const updateRecord = async () => {
        const recordX = await loadRecord(playerX.name);
        const recordO = await loadRecord(playerO.name);
        setPlayerX(prevState => ({...prevState, record: recordX}));
        setPlayerO(prevState => ({...prevState, record: recordO}));
      }
      updateRecord();
      setGameEnded(false);
    }
  }, [gameEnded]);

  const showAlert = (message) => {
    Alert.alert(
      "Game over",
      message,
      [
        { 
          text: "OK", 
          onPress: async () => {
            handleReset(); 
            setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
            if (message.includes('has won')) {
              const winner = message.split(' ')[1];
              const loser = winner === playerX.name ? playerO.name : playerX.name
              const winnerRecord = winner === playerX.name ? playerX.record : playerO.record;
              const loserRecord = winner === playerX.name ? playerO.record : playerX.record;
              winnerRecord.wins += 1;
              loserRecord.losses += 1;
              await saveRecord(winner, winnerRecord);
              await saveRecord(loser, loserRecord);
              setGameEnded(true);
            } else if (message.includes('draw')) {
              playerX.record.draws += 1;
              playerO.record.draws += 1;
              await saveRecord(playerX.name, playerX.record);
              await saveRecord(playerO.name, playerO.record);
              setGameEnded(true);
            }
          } 
        }
      ],
      { cancelable: false}
    );
  };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
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
    const winner = currentPlayer === 'X' ? playerO.name : playerX.name;
    const loser = winner === playerX.name ? playerO.name : playerX.name;
    playSound('win.wav');
    Alert.alert(
      "Game over",
      `Player ${winner} has won!`,
      [
        { 
          text: "OK", 
          onPress: async () => {
            handleReset(); 
            setHistory([{cells: Array(9).fill(null), currentPlayer: 'X'}]);
            const winnerRecord = winner === playerX.name ? playerX.record : playerO.record;
            const loserRecord = winner === playerX.name ? playerO.record : playerX.record;
            winnerRecord.wins += 1;
            loserRecord.losses += 1;
            await saveRecord(winner, winnerRecord);
            await saveRecord(loser, loserRecord);
            setGameEnded(true);
          } 
        }
      ],
      { cancelable: false }
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
        { label: 'Reset Records', id: 'reset_records' },
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
        case 'reset_records':
          resetRecord();
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
        <Button title="Logout" onPress={handleLogout} />
        <Text style={{...styles.currentPlayer}}>{`Current Player: ${currentPlayer}`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Player X: ${playerX.name} (Wins: ${playerX.record.wins}, Losses: ${playerX.record.losses}, Draws: ${playerX.record.draws})`}</Text>
        <Text style={{...styles.currentPlayer}}>{`Player O: ${playerO.name} (Wins: ${playerO.record.wins}, Losses: ${playerO.record.losses}, Draws: ${playerO.record.draws})`}</Text>
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
