import React from "react";
import NavigationApp from "./src/navigation/NavigationApp";
import Intro from "./src/pages/Intro";
import { Store } from "./src/redux/Store";
import { Provider } from "react-redux";
import { StatusBar } from "react-native";
class App extends React.Component {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }

  render() {
    let { isLoading } = this.state;
    return (
      <Provider store={Store}>
        {isLoading ? (
          <Intro />
        ) : (
          <React.Fragment>
            <StatusBar backgroundColor="#4b4bff" barStyle="light-content" />
            <NavigationApp />
          </React.Fragment>
        )}
      </Provider>
    );
  }
}

export default App;
