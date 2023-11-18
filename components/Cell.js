import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Cell = ({ onPress, value, colorX, colorO }) => {
  const textColor = value === 'X' ? colorX : colorO;
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      <Text style={{...styles.cellText, color : textColor}}>{value}</Text>
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
