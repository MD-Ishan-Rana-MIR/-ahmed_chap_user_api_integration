import { useUserProfileQuery } from "@/redux/authApi";
import { useFonts } from "expo-font";
import { router, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import tw from "../../lib/tailwind";

// Prevent auto hiding of splash screen
SplashScreen.preventAutoHideAsync();

const Index = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Manrope-Bold": require("../../assets/font/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("../../assets/font/Manrope-ExtraBold.ttf"),
    "Manrope-SemiBold": require("../../assets/font/Manrope-SemiBold.ttf"),
    "Manrope-Medium": require("../../assets/font/Manrope-Medium.ttf"),
    "Manrope-Light": require("../../assets/font/Manrope-Light.ttf"),
    "Manrope-Regular": require("../../assets/font/Manrope-Regular.ttf"),
    "Manrope-ExtraLight": require("../../assets/font/Manrope-ExtraLight.ttf"),
  });

  const { data: userProfile, isLoading, isFetching } = useUserProfileQuery({});

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleNavigation = async () => {
      // Font load complete ebong RTK Query fetch execution finish hole process korbe
      if ((fontsLoaded || fontError) && !isLoading && !isFetching) {
        timeout = setTimeout(async () => {
          await SplashScreen.hideAsync();

          // Authentic User handle korar condition
          if (userProfile) {
            router.replace("/(user-tab)");
          } else {
            router.replace("/(splash-screen)");
          }
        }, 1200);
      }
    };

    handleNavigation();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [fontsLoaded, fontError, isLoading, isFetching, userProfile]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      <View style={tw`flex-1 px-4 justify-between py-10`}>
        {/* Loading Indicator */}
        <View style={tw`items-center`}>
          {(isLoading || isFetching) && (
            <ActivityIndicator size="large" color="#FF5A1F" />
          )}
        </View>

        {/* App Center Content / Logo Placeholder */}
        <View style={tw`items-center justify-center flex-1`}>
          {/* Logo add korte paren */}
        </View>

        <View style={tw`h-20`} />
      </View>
    </View>
  );
};

export default Index;
