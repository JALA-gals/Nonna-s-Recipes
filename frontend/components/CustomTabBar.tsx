import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const { width } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // Special center button
        if (route.name === "addrecipe") {
          return (
            <View key={route.key} style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                style={styles.centerButton}
              >
                <Ionicons name="add" size={32} color="#7B3306" />
              </TouchableOpacity>
            </View>
          );
        }

        const icon = getIcon(route.name, isFocused);

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
                {isFocused && <View style={styles.activeBox} />}
                {icon}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getIcon(name: string, focused:boolean) {
  const color = focused ? "#BB4D00" : "#973C00";
  const opacity= focused ? 1: 0.7;

  switch (name) {
    case "map":
      return <Ionicons name="location-outline" size={24} color={color} style={{ opacity }} />;
    case "recording":
      return <Ionicons name="mic-outline" size={24} color={color} style={{ opacity }} />;
    case "App":
      return <Ionicons name="compass-outline" size={24} color={color} style={{ opacity }} />;
  }
}

const styles = StyleSheet.create({
    activeBox:{
        position: "absolute",
        width: 47,              
        height: 47,
        borderRadius: 12,
        backgroundColor:"#FEE685",
        opacity:0.6,
        top: 1.5, 
        left: 1.5,
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width:50,
        height:50,
    },


    container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    position: "absolute",
    bottom: 0,
     
    marginHorizontal: "auto",
    width,
    height: 100,
    borderTopLeftRadius: 41,
    borderTopRightRadius: 41,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,


    paddingHorizontal: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  centerButton: {
    width: 68,
    height: 70,
    borderRadius: 30,
    backgroundColor: "#FFCC7F",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});