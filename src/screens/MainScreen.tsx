import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from '../components/Header/Header';
import { getAddressFromCoords } from '../utils/GeoUtils';

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

  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const getMyLocation = useCallback(async () => {
    Geolocation.getCurrentPosition((position) => {
      console.log(position);

      console.log(position);
      setCurrentRegion((prevState) => {
        return {
          ...prevState,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      });

      getAddressFromCoords(position.coords.latitude, position.coords.longitude).then(
        setCurrentAddress,
      );
    });
  }, []);

  const onChangeLocation = useCallback<(item: { latitude: number; longitude: number }) => {}>(
    async (item) => {
      setCurrentRegion((prevState) => {
        return {
          ...prevState,
          latitude: item.latitude,
          longitude: item.longitude,
        };
      });

      getAddressFromCoords(item.latitude, item.longitude).then(setCurrentAddress);
    },
    [],
  );

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
        }}
        onLongPress={(event) => {
          onChangeLocation(event.nativeEvent.coordinate);
        }}>
        <Marker
          coordinate={{
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          }}
        />
      </MapView>

      {currentAddress !== null && (
        <View style={StyleSheet.address}>
          <View style={styles.addressContent}>
            <Text style={styles.addressText}>{currentAddress}</Text>
          </View>
        </View>
      )}
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
  address: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    backgroundColor: 'gray',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  addressText: {
    fontSize: 16,
    color: 'white',
  },
});
