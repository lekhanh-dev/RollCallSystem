import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfilePage from "../../pages/ProfilePage";

const ProfileStack = createStackNavigator();

class ProfileTab extends React.Component {
  render() {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="ProfilePage"
          options={{
            title: "Thông tin cá nhân",
            headerStyle: {
              backgroundColor: "#4b4bff",
            },
            headerTintColor: "#fff",
          }}
        >
          {(props) => <ProfilePage {...props} />}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    );
  }
}

export default ProfileTab;
