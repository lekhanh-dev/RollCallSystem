import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { uploadFiles, saveImageToDB } from "../services/userService";
import * as ScreenOrientation from "expo-screen-orientation";
import * as ImageManipulator from "expo-image-manipulator";
import AnimatedProgressWheel from "react-native-progress-wheel";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MyCamera({ navigation, route }) {
  // console.log(route.params.classObj);
  const camRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [progressInfos, setProgressInfos] = useState([]);

  useEffect(() => {
    // Ignore log notification by message:
    LogBox.ignoreLogs(["Warning: ..."]);

    // Ignore all log notifications:
    LogBox.ignoreAllLogs();

    registerForPushNotificationsAsync();

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted");
    })();

    (async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);
    })();

    // Component will unmount
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync({
        quality: 1,
        exif: false,
        skipProcessing: false,
        // base64: true,
      });

      // Send image to server
      if (type === 0) {
        let file = {
          uri: data.uri,
          type: "image/jpeg",
          name: "photo.jpg",
        };

        let _progressInfos = [{ percentage: 0 }, ...progressInfos];
        uploadFiles(
          file,
          (event) => {
            // console.log(event);
            _progressInfos[0].percentage = Math.round(
              (100 * event.loaded) / event.total
            );
            // console.log(_progressInfos[0]);
            setProgressInfos([..._progressInfos]);
          },
          route.params.classObj.code
        )
          .then(async (res) => {
            let length = res.data.length;
            let data = "Sinh viên: ";
            if (length === 0) {
              await schedulePushNotification(0, "Không tìm thấy sinh viên nào");
            } else {
              res.data.map((value, index) => {
                data = data + value.name + " - " + value.code + ", ";
              });
              await schedulePushNotification(length, data);
            }
            saveImageToDB(route.params.classObj.code);
          })
          .catch((err) => console.log(err));
        setCapturePhoto(data.uri);
        setImageList([data.uri, ...imageList]);
      } else {
        const manipResult = await ImageManipulator.manipulateAsync(
          data.localUri || data.uri,
          [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Vertical }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        ).then((value) => {
          let file = {
            uri: value.uri,
            type: "image/jpeg",
            name: "photo.jpg",
          };

          let _progressInfos = [{ percentage: 0 }, ...progressInfos];
          uploadFiles(
            file,
            (event) => {
              // console.log(event);
              _progressInfos[0].percentage = Math.round(
                (100 * event.loaded) / event.total
              );
              // console.log(_progressInfos[0]);
              setProgressInfos([..._progressInfos]);
            },
            route.params.classObj.code
          )
            .then(async (res) => {
              let length = res.data.length;
              let data = "Sinh viên: ";
              if (length === 0) {
                await schedulePushNotification(
                  0,
                  "Không tìm thấy sinh viên nào"
                );
              } else {
                res.data.map((value, index) => {
                  data = data + value.name + " - " + value.code + ", ";
                });
                await schedulePushNotification(length, data);
              }
              saveImageToDB(route.params.classObj.code);
            })
            .catch((err) => console.log(err));
          setCapturePhoto(value.uri);
          setImageList([value.uri, ...imageList]);
        });
      }
    }
  }

  // async function getOrientation() {
  //   const asset = await ScreenOrientation.getOrientationAsync();
  //   alert(asset);
  // }

  // async function savePicture() {
  //   // Save image into Gallery
  //   const asset = await MediaLibrary.createAssetAsync(capturePhoto)
  //     .then((error) => {
  //       alert("Saved");
  //     })
  //     .catch((error) => {
  //       console.log("err", error);
  //     });

  //   let file = {
  //     uri: capturePhoto,
  //     type: "image/jpeg",
  //     name: "photo.jpg",
  //   };
  //   uploadFiles(file, route.params.classObj.code)
  //     .then()
  //     .catch((err) => console.log(err));
  // }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>Không truy cập được máy ảnh</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <Camera
        ref={camRef}
        style={{ flex: 1 }}
        type={type}
        autoFocus="on"
        zoom={0}
        // ratio="16:9"
        ratio="4:3"
      >
        <View style={styles.container}>
          <View style={styles.containerButton}>
            <TouchableOpacity
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Icon name="refresh" size={45} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity onPress={takePicture}>
              <Icon name="circle" size={70} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity onPress={() => setOpen(true)}>
              {capturePhoto ? (
                <Image
                  style={styles.imageIcon}
                  source={{ uri: capturePhoto }}
                />
              ) : (
                <Icon name="image" size={50} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Camera>

      <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <ScrollView>
          <View style={styles.containerImage}>
            {/* <View>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => setOpen(false)}
              >
                <Icon name="close" size={50} color="red" />
              </TouchableOpacity>
              <TouchableOpacity style={{ margin: 10 }} onPress={savePicture}>
                <Icon name="upload" size={50} color="red" />
              </TouchableOpacity>
            </View> */}
            {/* <Image style={styles.image} source={{ uri: capturePhoto }} /> */}
            {imageList.map((value, index) => {
              return (
                <View key={index} style={styles.wrapImage}>
                  <Image style={styles.image} source={{ uri: value }} />
                  <View style={styles.wrapProgress}>
                    <AnimatedProgressWheel
                      size={50}
                      width={5}
                      color={"yellow"}
                      progress={
                        progressInfos[index]
                          ? progressInfos[index].percentage
                          : 0
                      }
                      backgroundColor={"transparent"}
                    />
                    <Text style={styles.progressText}>
                      {progressInfos[index]
                        ? progressInfos[index].percentage
                        : 0}
                      %
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  containerButton: {
    width: "33.33333%",
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 25,
    paddingBottom: 35,
  },
  containerImage: {
    margin: 20,
  },
  wrapImage: {
    position: "relative",
  },
  wrapProgress: {
    position: "absolute",
  },
  progressText: {
    color: "yellow",
    position: "absolute",
    top: 15,
    left: 8,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 30,
    marginBottom: 30,
  },
  imageIcon: {
    width: 50,
    height: 50,
  },
});

async function schedulePushNotification(num, data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Tìm thấy ${num} sinh viên`,
      body: data,
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
