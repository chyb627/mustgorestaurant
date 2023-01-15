import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from '../components/Header/Header';

export const MainScreen: React.FC = () => {
  // latitude: 37.4922459
  // longitude: 127.0881366

  const [currentRegion, setCurrentRegion] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.4922459,
    longitude: 127.0881366,
  });

  console.log('currentRegion:::', currentRegion);

  const getMyLocation = useCallback(() => {
    Geolocation.getCurrentPosition((position) => {
      setCurrentRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    getMyLocation();
  }, [getMyLocation]);

  return (
    <View style={styles.container}>
      <Header>
        <Header.Title title="Main" />
      </Header>

      <MapView
        style={styles.map}
        region={{
          // 위치
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude,

          // 지도가 보이는 화면의 크기
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          }}
        />
      </MapView>
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
