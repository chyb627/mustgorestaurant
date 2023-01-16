import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Header } from '../components/Header/Header';
import { SingleLineInput } from '../components/SingleLineInput';
import { useRootNavigation } from '../navigation/RootNavigation';
import {
  getAddressFromCoords,
  getCoordsFromAddress,
  getCoordsFromKeyword,
} from '../utils/GeoUtils';
import { getRestrauntList } from '../utils/RealTimeDbUtils';

export const MainScreen: React.FC = () => {
  // latitude: 37.4922459
  // longitude: 127.0881366

  const navigation = useRootNavigation<'Main'>();

  const [query, setQuery] = useState<string>('');
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [markerList, setMarkerList] = useState<
    { latitude: number; longitude: number; title: string; address: string }[]
  >([]);
  console.log('markerList::', markerList);
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

  const onFindAddress = useCallback<() => Promise<void>>(async () => {
    const keywordResult = await getCoordsFromKeyword(query);
    const addressResult = await getCoordsFromAddress(query);

    if (keywordResult !== null) {
      setCurrentAddress(keywordResult.address);
      setCurrentRegion({
        latitude: parseFloat(keywordResult.latitude.toString()),
        longitude: parseFloat(keywordResult.longitude.toString()),
      });
      return;
    }

    if (addressResult === null) {
      console.error('주소값을 찾지 못했습니다.');
      return;
    }

    setCurrentAddress(addressResult.address);
    setCurrentRegion({
      latitude: parseFloat(addressResult.latitude.toString()),
      longitude: parseFloat(addressResult.longitude.toString()),
    });
  }, [query]);

  const onPressBottomAddress = useCallback(() => {
    if (currentAddress === null) {
      return;
    }

    navigation.push('Add', {
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
      address: currentAddress,
    });
  }, [currentAddress, currentRegion.latitude, currentRegion.longitude, navigation]);

  const onMapReady = useCallback(async () => {
    setIsMapReady(true);
    const restrauntList = await getRestrauntList();
    setMarkerList(restrauntList);
  }, []);

  useEffect(() => {
    getMyLocation();
  }, [getMyLocation]);

  return (
    <View style={styles.container}>
      {/* <Header>
        <Header.Title title="Main" />
      </Header> */}

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
        onMapReady={onMapReady}
        onLongPress={(event) => {
          onChangeLocation(event.nativeEvent.coordinate);
        }}>
        {isMapReady && (
          <Marker
            coordinate={{
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            }}
          />
        )}

        {isMapReady &&
          markerList.map((item, index) => {
            return (
              <Marker
                key={`marker-list-${index}`}
                title={item.title}
                description={item.address}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                pinColor="blue"
              />
            );
          })}
      </MapView>

      <View style={styles.inputContainer}>
        <View style={styles.inputBackground}>
          <SingleLineInput
            value={query}
            placeholder="주소를 입력해 주세요"
            onChangeText={setQuery}
            onSubmitEditing={onFindAddress}
          />
        </View>
      </View>

      {currentAddress !== null && (
        <View style={styles.address}>
          <Pressable onPress={onPressBottomAddress} style={styles.addressContent}>
            <Text style={styles.addressText}>{currentAddress}</Text>
          </Pressable>
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
  inputContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
  },
  inputBackground: {
    backgroundColor: 'white',
  },
});
