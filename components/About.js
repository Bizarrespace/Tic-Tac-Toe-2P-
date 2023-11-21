import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Page By Long Vu</Text>
      <Text style={styles.text}>Feature Update: I added a move timer. Once the timer is up, the current player loses.</Text>
      <Text style={styles.text}>This feature adds urgency to the game.</Text>
      <View style={{marginTop: 10}}>
        <Text style={styles.text}>There is a slight bug where two alerts are triggered when the timer runs out, but the win is assigned to the correct player. I believe it has something to do with the async nature, but I have spent too much time on this problem already xd</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  text: {
    fontSize: 18,
    color: 'black',
    padding: 5
  },
});

export default About;