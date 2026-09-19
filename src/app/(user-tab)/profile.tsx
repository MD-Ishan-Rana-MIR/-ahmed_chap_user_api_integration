import { useLogoutMutation, useUserProfileQuery } from "@/redux/authApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import BackButton from "../../../components/ui/BackButton";
import {
  aboutIcon,
  addreessIcon,
  logoutIcon,
  notificationIcon,
  personalInfoIcon,
  privacyIcon,
  settingIcon,
  termIcon,
} from "../../../lib/icon";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";

interface MenuItemProps {
  iconName: string;
  title: string;
  onPress?: () => void;
  isLogout?: boolean;
  isLast?: boolean;
}

const MenuItem = ({
  iconName,
  title,
  onPress,
  isLogout = false,
  isLast = false,
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      tw`flex-row items-center justify-between py-3 px-4`,
      !isLast && tw`border-b border-gray-100`,
    ]}
  >
    <View style={tw`flex-row items-center gap-x-3`}>
      <View
        style={tw`w-10 h-10 rounded-full items-center justify-center border-[2px] border-[#F3F3F3] ${
          isLogout ? "" : "bg-[#FFFFFF]"
        }`}
      >
        <SvgXml
          xml={iconName}
          width={18}
          color={isLogout ? "#EF4444" : "#374151"}
        />
      </View>

      <Text
        style={tw`text-[16px] font-Manrope-Medium ${
          isLogout ? "text-[#EF4444] font-semibold" : "text-[#222222]"
        }`}
      >
        {title}
      </Text>
    </View>

    {!isLogout && <Ionicons name="chevron-forward" size={18} color="#000000" />}
  </TouchableOpacity>
);

export default function Profile() {
  const { data: userProfile, isLoading } = useUserProfileQuery({});
  const [logout] = useLogoutMutation();

  const user = userProfile?.data || userProfile;

  const menuItems = [
    {
      iconName: personalInfoIcon,
      title: "Personal Information",
      link: "personal-info",
    },
    {
      iconName: settingIcon,
      title: "Account Settings",
      link: "setting",
    },
    {
      iconName: addreessIcon,
      title: "Delivery Address",
      link: "address",
    },
    {
      iconName: notificationIcon,
      title: "Notifications",
      link: "notification",
    },
    { iconName: aboutIcon, title: "About Us", link: "about" },
    {
      iconName: privacyIcon,
      title: "Privacy Policy",
      link: "privacy",
    },
    { iconName: termIcon, title: "Terms of service", link: "term" },
    { iconName: logoutIcon, title: "Log Out", isLogout: true },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await logout({}).unwrap();

              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("expo-token");
              await AsyncStorage.removeItem("forget-password-token");

              successMsg(res?.message || "Logged out successfully");
              router.replace("/(auth)/Login");
            } catch (error) {
              errorMsg(
                error && typeof error === "object" && "data" in error
                  ? ((error as { data?: { message?: string } }).data?.message ??
                      String(error))
                  : error instanceof Error
                    ? error.message
                    : String(error),
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`bg-white px-5 mt-5 pb-8`}
      >
        <View
          style={tw`bg-[#FCFCFC] rounded-2xl border border-[#EDEDED] shadow-sm overflow-hidden`}
        >
          {/* User Header Section */}
          <View
            style={tw`flex-row items-center gap-x-3 border-b px-4 pt-4 pb-6 border-gray-100`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FF5A1F" />
            ) : (
              <>
                <Image
                  source={{
                    uri:
                      user?.profile_photo_url ||
                      user?.profile_photo_url ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
                  }}
                  style={tw`w-12 h-12 rounded-full bg-gray-200`}
                />
                <View style={tw`flex-1`}>
                  <Text
                    style={tw`text-[16px] font-Manrope-Bold text-[#222222]`}
                  >
                    {user?.name || user?.full_name || "User Name"}
                  </Text>
                  <Text
                    style={tw`text-xs font-Manrope-Regular text-[#858585] mt-1`}
                  >
                    {user?.email || "user@example.com"}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Menu Items List */}
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              iconName={item.iconName}
              title={item.title}
              isLogout={item.isLogout}
              isLast={index === menuItems.length - 1}
              onPress={() => {
                if (item.isLogout) {
                  handleLogout();
                } else if (item.link) {
                  router.push({
                    pathname: "/link/[id]",
                    params: { id: item?.link },
                  });
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
