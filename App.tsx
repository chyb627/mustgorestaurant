import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Icon } from './src/components/Icons';

const App = () => {
  return (
    <SafeAreaView style={styles.body}>
      <View>
        <Icon name="arrow-back" size={24} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export default App;
