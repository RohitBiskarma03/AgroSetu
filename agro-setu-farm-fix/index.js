import { AppRegistry } from "react-native";
import TabNavigator from "./app/tab/index";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => TabNavigator);
