import { Platform } from "react-native";

export const domain = __DEV__
  ? Platform.select({
      ios: `http://192.168.50.3:8000`,
      android: `http://192.168.50.3:8000`,
    })
  : `https://lazybus.com`;

export const searchNearbyBusStops = `${domain}/nearby-bus-stops`;

export const searchBusStops = `${domain}/bus-stops`;
