import Toast from "react-native-toast-message";

export const successMsg = (title: string, message?: string) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};
