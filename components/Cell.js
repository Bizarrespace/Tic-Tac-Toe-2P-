import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Cell = ({ onPress, value }) => {
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      <Text style={styles.cellText}>{value}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
    cell: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cellText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
      },
})

export default Cell;
