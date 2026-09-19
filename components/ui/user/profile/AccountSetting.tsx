import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { lockIcon, profileDelete, rightBackIcon } from "../../../../lib/icon";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";

export default function AccountSetting() {
  const handleNavigate = () => {
    router.push(`/link/${"password-change"}` as any);
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Account Settings" showBackButton={true} />

      <View style={tw`px-5 pt-5`}>
        {/* Settings Card */}
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          style={tw`bg-[#FCFCFC] rounded-t-[12px] p-4 border border-[#E5E7EB] flex-row items-center justify-between shadow-sm`}
        >
          {/* Left Container: Icon + Title */}
          <View style={tw`flex-row items-center gap-x-3.5`}>
            {/* Lock Icon Wrapper */}
            <View
              style={tw`w-10 h-10 bg-white rounded-full border border-[#F3F3F3] justify-center items-center shadow-sm`}
            >
              <SvgXml xml={lockIcon} width={16} height={16} />
            </View>

            {/* Label */}
            <Text
              style={tw` font-Manrope-Medium.ttf text-[16px] text-blackText `}
            >
              Change Password
            </Text>
          </View>

          {/* Right Chevron / Arrow Indicator */}
          <SvgXml xml={rightBackIcon} width={16} height={16} />
        </TouchableOpacity>
        <TouchableOpacity
          //   onPress={onChangePassword}
          activeOpacity={0.7}
          style={tw`bg-[#FCFCFC] rounded-b-[12px] p-4 border border-[#E5E7EB] flex-row items-center justify-between shadow-sm`}
        >
          {/* Left Container: Icon + Title */}
          <View style={tw`flex-row items-center gap-x-3.5`}>
            {/* Lock Icon Wrapper */}
            <View
              style={tw`w-10 h-10 bg-white rounded-full border border-[#F3F3F3] justify-center items-center shadow-sm`}
            >
              <SvgXml xml={profileDelete} width={16} height={16} />
            </View>

            {/* Label */}
            <Text
              style={tw` font-Manrope-Medium.ttf text-[16px] text-blackText `}
            >
              Delete Your account
            </Text>
          </View>

          {/* Right Chevron / Arrow Indicator */}
          <SvgXml xml={rightBackIcon} width={16} height={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
