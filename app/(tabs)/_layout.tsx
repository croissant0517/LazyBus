import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <Image
    source={source}
    resizeMode="contain"
    className="w-7 h-7"
    tintColor={focused ? "#0286FF" : "gray"}
  />
);

export default function Layout() {
  return (
    <Tabs initialRouteName="bus">
      <Tabs.Screen
        name="bus"
        options={{
          title: "Bus",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.bus} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.setting} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
