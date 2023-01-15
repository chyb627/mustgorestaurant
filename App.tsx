import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { RootNavigation } from './src/navigation/RootNavigation';

const App = () => {
  return (
    <SafeAreaView style={styles.body}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export default App;
