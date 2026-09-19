import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import tw from "../../../lib/tailwind";

export default function AuthLayout() {
  return (
    <View style={tw`flex-1`}>
      {/* Set Status Bar background color to olive */}
      <StatusBar style="light" />

      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="email-verify" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </View>
  );
}
