import { store } from "@/store/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { toastConfig } from "../../lib/msg/CustomToastConfig";

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(splash-screen)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(user-tab)" />
        </Stack>
        <Toast config={toastConfig} />
      </Provider>
    </>
  );
}
