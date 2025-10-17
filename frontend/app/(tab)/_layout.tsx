import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ThemedView } from "../../components/ui/themed-view";
import useThemeColor from "../../hooks/use-theme-color";
import { HomeScreen } from "./home";
import { AboutScreen } from "./about";
import { LoginScreen } from "./login";
import { HapticTab } from "../../components/ui/haptic-tab";
import { AuthContext } from "../../context/AuthContext";
import { ThemedText } from "../../components/ui/themed-text";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export function TabLayout() {
  const backgroundColor = useThemeColor("background");
  const tabBarColor = useThemeColor("card");
  const { userRole, isAuthenticated } = useContext(AuthContext);

  // Role-based tab visibility
  // Everyone sees About
  // Login tab only visible when not authenticated
  // Home tab visible only when authenticated
  // Admin, Dealer, Farmer see Home with different dashboards

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: tabBarColor, borderTopColor: useThemeColor("border") },
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarActiveTintColor: useThemeColor("primary"),
          tabBarInactiveTintColor: useThemeColor("text"),
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color, size }) => {
            let iconName = "ellipse";

            if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "About") iconName = "information-circle-outline";
            else if (route.name === "Login") iconName = "log-in-outline";

            return <Icon name={iconName} color={color} size={size} />;
          },
        })}
      >
        {isAuthenticated && (
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Dashboard" }} />
        )}
        <Tab.Screen name="About" component={AboutScreen} />
        {!isAuthenticated && <Tab.Screen name="Login" component={LoginScreen} />}
      </Tab.Navigator>
    </ThemedView>
  );
}
