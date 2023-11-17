import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const GameControls = ({ handleUndo, handleReset, handleResign }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}> 
        <Button style={styles.button} title="Undo" onPress={handleUndo} />
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="New Game" onPress={handleReset} />
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Resign" onPress={handleResign} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    margin: 10,
  },
  button: {
    width: '100%',
  },
});

export default GameControls;