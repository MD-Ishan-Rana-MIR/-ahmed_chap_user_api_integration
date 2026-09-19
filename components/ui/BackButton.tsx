import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { backIcon } from "../../lib/icon";
import tw from "../../lib/tailwind";

interface HeaderBarProps {
  title?: string;
  onPress?: () => void;
  showTitle?: boolean;
  showBackButton?: boolean;
}

const BackButton = ({
  title = "Back",
  onPress,
  showTitle = true,
  showBackButton = true,
}: HeaderBarProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={tw`bg-bgOlive px-5 pb-5 shadow shadow-[#4A4A4A40] rounded-b-[12px]`}
    >
      <StatusBar style="light" />
      <SafeAreaView edges={["top"]}>
        <View style={tw`mt-4 flex-row items-center gap-x-3`}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={tw`border border-white rounded-full w-8 h-8 justify-center items-center`}
            >
              <SvgXml xml={backIcon} width={12} height={12} />
            </TouchableOpacity>
          )}

          {showTitle && (
            <Text
              style={tw`text-primaryText text-lg font-Manrope-SemiBold.ttf flex-1`}
            >
              {title}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BackButton;
