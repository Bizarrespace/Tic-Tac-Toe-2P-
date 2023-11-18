// PlayerInput.js
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const PlayerInput = ({ onStartGame }) => {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');

  const startGame = () => {
    onStartGame(playerX, playerO);
  };

  return (
    <View>
      <TextInput 
        placeholder="Player X Name" 
        placeholderTextColor="black"
        value={playerX} 
        onChangeText={setPlayerX} 
        style={{color: 'black'}}
      />
      <TextInput 
        placeholder="Player O Name" 
        placeholderTextColor="black"
        value={playerO} 
        onChangeText={setPlayerO} 
        style={{color: 'black'}}
      />
      <Button title="Start Game" onPress={startGame} />
    </View>
  );
};

export default PlayerInput;