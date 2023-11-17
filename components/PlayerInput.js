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
        value={playerX} 
        onChangeText={setPlayerX} 
      />
      <TextInput 
        placeholder="Player O Name" 
        value={playerO} 
        onChangeText={setPlayerO} 
      />
      <Button title="Start Game" onPress={startGame} />
    </View>
  );
};

export default PlayerInput;