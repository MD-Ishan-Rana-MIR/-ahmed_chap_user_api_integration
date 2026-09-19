import Toast from "react-native-toast-message";

export const errorMsg = (title: string, message?: string) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 4000,
  });
};
