import { Platform } from "react-native";

export const domain = __DEV__
  ? "http://172.20.10.3:8000"
  : `https://lazybus.com`;

export const searchNearbyBusStops = `${domain}/nearby-bus-stops`;

export const searchBusStops = `${domain}/bus-stops`;
