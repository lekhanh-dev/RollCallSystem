import AsyncStorage from "@react-native-async-storage/async-storage";

class asyncStorageService {
  setStringValue = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // save error
      console.log("Saving error");
    }
    console.log("Done.");
  };

  setObjectValue = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // save error
      console.log("Saving error");
    }
    console.log("Done.");
  };

  getMyObject = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
      console.log(e);
    }
    console.log("Done.");
  };

  getMyStringValue = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      // read error
      console.log(e);
    }
    console.log("Done.");
  };

  removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
      console.log("Remove error");
    }
    console.log("Done.");
  };

  clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };
}

export default new asyncStorageService();
