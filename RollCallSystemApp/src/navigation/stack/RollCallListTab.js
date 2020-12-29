import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RollCallListPage from "../../pages/RollCallListPage";
import RollCallDetailPage from "../../pages/RollCallDetailPage";
import MyCamera from "../../components/MyCamera";

const RollCallListStack = createStackNavigator();

class RollCallListTab extends React.Component {
  render() {
    return (
      <RollCallListStack.Navigator initialRouteName="RollCallListPage">
        <RollCallListStack.Screen
          name="RollCallListPage"
          options={{
            title: "Danh sách lớp học",
            headerStyle: {
              backgroundColor: "#4b4bff",
            },
            headerTintColor: "#fff",
          }}
        >
          {(props) => <RollCallListPage {...props} />}
        </RollCallListStack.Screen>
        <RollCallListStack.Screen
          name="RollCallDetailPage"
          options={{
            title: "Chi tiết lớp học",
            headerStyle: {
              backgroundColor: "#4b4bff",
            },
            headerTintColor: "#fff",
          }}
        >
          {(props) => <RollCallDetailPage {...props} />}
        </RollCallListStack.Screen>
        <RollCallListStack.Screen
          name="Camera"
          options={{ headerShown: false }}
        >
          {(props) => <MyCamera {...props} />}
        </RollCallListStack.Screen>
      </RollCallListStack.Navigator>
    );
  }
}

export default RollCallListTab;
