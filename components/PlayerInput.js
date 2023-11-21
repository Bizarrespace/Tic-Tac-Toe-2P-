import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const PlayerInput = ({ onStartGame }) => {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [newPlayerX, setNewPlayerX] = useState('');
  const [newPlayerO, setNewPlayerO] = useState('');
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const playerKeys = keys.filter(key => key.startsWith('@record_'));
      const playerNames = playerKeys.map(key => key.replace('@record_', ''));
      setPlayers(playerNames);
    };

    const fetchLeaderboard = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const playerKeys = keys.filter(key => key.startsWith('@record_'));
      const records = await Promise.all(playerKeys.map(async key => {
        const record = await AsyncStorage.getItem(key);
        return { name: key.replace('@record_', ''), ...JSON.parse(record) };
      }));
      const sortedRecords = records.sort((a, b) => (b.wins + b.draws) - (a.wins + a.draws));
      setLeaderboard(sortedRecords);
    };

    fetchPlayers();
    fetchLeaderboard();
  }, []);

  const startGame = () => {
    const x = newPlayerX !== '' ? newPlayerX : playerX;
    const o = newPlayerO !== '' ? newPlayerO : playerO;

    if (x === '' || o === '') {
      alert('Please select a player for both X and O');
      return;
    }

    onStartGame(x, o);
  };

  return (
    <View>
      <TextInput placeholder="Enter New Player X" value={newPlayerX} onChangeText={setNewPlayerX} style={{color: 'black', borderColor: 'black', borderWidth: 1}} placeholderTextColor='black' />
      <Picker selectedValue={playerX || "Choose an existing player"} onValueChange={setPlayerX} style={{color:'black'}}>
        <Picker.Item label="Choose an existing player" value="" />
        {players.map(player => <Picker.Item key={player} label={player} value={player} color='white' />)}
      </Picker>
      <TextInput placeholder="Enter New Player O" value={newPlayerO} onChangeText={setNewPlayerO} style={{color: 'black', borderColor: 'black', borderWidth: 1}} placeholderTextColor='black' />
      <Picker selectedValue={playerO || "Choose an existing player"} onValueChange={setPlayerO} style={{color:'black'}}>
        <Picker.Item label="Choose an existing player" value="" />
        {players.map(player => <Picker.Item key={player} label={player} value={player} color='white' />)}
      </Picker>
      <Button title="Start Game" onPress={startGame}/>
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text style={{color: 'red', fontSize: 30, fontWeight: 'bold'}}>Leaderboard</Text>
        {leaderboard.map((player, index) => (
          <Text key={index} style={{color: 'black', textAlign: 'center', fontSize: 16, marginBottom: 10}}>{`${index + 1}) ${player.name}: ${player.wins} wins, ${player.draws} draws, ${player.losses} losses`}</Text>
        ))}
      </View>
    </View>
  );
};

export default PlayerInput;