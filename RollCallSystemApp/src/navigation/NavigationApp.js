import React from "react";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginPage from "../pages/LoginPage";
import ProfileTab from "./stack/ProfileTab";
import RollCallListTab from "./stack/RollCallListTab";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class NavigationApp extends React.Component {
  render() {
    return (
      <React.Fragment>
        {!this.props.login.success ? (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginPage">
              <Stack.Screen
                name="LoginPage"
                options={{
                  title: "Đăng nhập",
                  headerStyle: {
                    backgroundColor: "#4b4bff",
                  },
                  headerTintColor: "#fff",
                }}
              >
                {(props) => <LoginPage {...props} extraData={{ x: 10 }} />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "Profile") {
                    iconName = focused ? "ios-person" : "ios-person";
                  } else if (route.name === "RollCallList") {
                    iconName = focused ? "ios-list-box" : "ios-list";
                  }

                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: "#4b4bff",
                inactiveTintColor: "gray",
              }}
            >
              <Tab.Screen name="RollCallList" component={RollCallListTab} />
              <Tab.Screen name="Profile" component={ProfileTab} />
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
});

export default connect(mapStateToProps)(NavigationApp);
