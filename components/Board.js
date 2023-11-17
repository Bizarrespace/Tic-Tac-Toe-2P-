import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Board = ({ cells, handleCellPress }) => {
  return (
    <View style={styles.board}>
      {[...Array(3)].map((_, colIndex) => (
        <View key={colIndex} style={styles.row}>
          {[...Array(3)].map((_, rowIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Cell
                key={index}
                onPress={() => handleCellPress(index)}
                value={cells[index]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
    board: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      row: {
        flexDirection: 'row',
      },
});

export default Board;