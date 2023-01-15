import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { Header } from '../components/Header/Header';

export const MainScreen: React.FC = () => {
  // latitude: 37.4922459
  // longitude: 127.0881366

  return (
    <View style={styles.container}>
      <Header>
        <Header.Title title="Main" />
      </Header>

      <MapView
        style={styles.map}
        region={{
          // 위치
          latitude: 37.4922459,
          longitude: 127.0881366,

          // 지도가 보이는 화면의 크기
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
