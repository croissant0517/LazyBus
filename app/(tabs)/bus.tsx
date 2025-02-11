import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useDebounce } from "use-debounce";

import InputField from "@/components/InputFeild";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { searchBusStops } from "@/lib/service";
import { BusStop } from "@/types/type";

import { icons } from "@/constants";

// const fetchNearbyBusStops = async (latitude: number, longitude: number) => {
//   const domain = __DEV__
//     ? Platform.select({
//         ios: `http://192.168.50.3:8000`,
//         android: `http://192.168.50.3:8000`,
//       })
//     : `https://lazybus.com`;

//   const url = `${domain}/nearby-bus-stops?latitude=${latitude}&longitude=${longitude} `;

//   // try {
//   //   const response = await fetch(url);
//   //   const data = await response.json();
//   //   return data.results;
//   // } catch (error) {
//   //   console.error("獲取公車站錯誤:", error);
//   // }

//   const { data, loading, error } = useFetch(url, {
//     method: "GET",
//   });

//   return { data, loading, error };
// };

const Bus = () => {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  console.log(
    "location",
    location?.coords.latitude,
    location?.coords.longitude
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  const url = useMemo(() => {
    return `${searchBusStops}?busStopName=${debouncedSearch}`;
  }, [debouncedSearch]);

  console.log("url", url);

  const [fetchData, { data, loading, error }] = useFetch<{
    results: BusStop[];
  }>();

  console.log("data", data);

  const handleSearch = async (text: string) => {
    setSearch(text.trim());
    setSelectedStop(null);
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("請允許LazyBus使用您的位置");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (url) {
      fetchData(url, {
        method: "GET",
      });
    }
  }, [url]);

  return (
    <SafeAreaView className="flex-1  bg-white p-5">
      <View className="flex-1">
        <View className="w-full">
          <View className="flex-row items-end gap-2">
            <View className="flex-1">
              <InputField
                className="w-full"
                label="今天想去哪裡呢？"
                placeholder="請輸入公車站名"
                inputMode="search"
                value={search}
                onChangeText={(text) => {
                  handleSearch(text);
                }}
                icon={icons.search}
              />
            </View>
            {/* <TouchableOpacity
              className="p-3 mb-4 w-fit"
              onPress={() => {
                router.navigate("/map");
              }}
            >
              <Image source={icons.map} className="w-6 h-6" />
            </TouchableOpacity> */}
          </View>
        </View>
        {!loading &&
          data?.results &&
          data?.results.length > 0 &&
          selectedStop === null && (
            <FlatList
              data={data?.results}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const { StopName, StopUID } = item || {};
                return (
                  <TouchableOpacity
                    key={StopUID}
                    className="bg-gray-200 p-2 rounded-md"
                    onPress={() => {
                      Keyboard.dismiss();
                      setSearch(StopName.Zh_tw);
                      setSelectedStop(item);
                    }}
                  >
                    <Text className="text-lg">{StopName.Zh_tw}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
      </View>
    </SafeAreaView>
  );
};

export default Bus;
