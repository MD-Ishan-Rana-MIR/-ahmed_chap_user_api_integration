// import { Ionicons } from "@expo/vector-icons";
import { useLoginMutation } from "@/redux/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { SvgXml } from "react-native-svg";
import CustomInput from "../../../components/CustomInput";
import PasswordInput from "../../../components/PasswordInput";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import { googleIcon } from "../../../lib/icon";
import { errorMsg } from "../../../lib/msg/errorMsg";
import { successMsg } from "../../../lib/msg/successMsg";
import tw from "../../../lib/tailwind";
interface LoginFormInputs {
  email: string; // Email or Phone
  password: string;
}
const Login = () => {
  const { authorize, clearSession, user, isLoading: socialLogin } = useAuth0();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // 1. Fetch current location
      let latitude: number | null = null;
      let longitude: number | null = null;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }

      // 2. Prepare payload
      const payload = {
        ...data,
        latitude,
        longitude,
      };

      const res = await login(payload).unwrap();

      if (res?.data?.token && res?.data?.user?.role === "USER") {
        // 3. Save Token & Coordinates to AsyncStorage
        await AsyncStorage.setItem("token", res.data.token);

        if (latitude !== null && longitude !== null) {
          await Promise.all([
            // AsyncStorage.setItem("latitude", latitude.toString()),
            AsyncStorage.setItem("latitude", latitude.toString()),
            AsyncStorage.setItem("longitude", longitude.toString()),
          ]);
        }

        successMsg(res.message);
        reset();

        // Navigate after state and storage updates complete
        router.push("/(user-tab)");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      return errorMsg(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authorize({
        customScheme: "auth0sample",
        scope: "openid profile email",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={tw` bg-bgOlive flex-1  `}>
      {/* back button  */}
      <View style={tw` relative overflow-hidden h-[218px] mb-1  `}>
        {/* Absolute Decorative Background Image (Top Right) */}
        {/* <Image
          source={require("../../../assets/images/world.png")}
          style={tw`absolute   -right-10 w-[274px] h-[274px] opacity-90`}
          resizeMode="contain"
        /> */}

        {/* Header Content */}
        <View style={tw`z-10 pr-20`}>
          {/* Back Button */}
          <View style={tw``}>
            <BackButton />
          </View>

          {/* Title & Subtitle */}
          <View style={tw`px-5`}>
            <Text style={tw`text-white text-2xl font-semibold mb-1.5`}>
              Welcome Back
            </Text>
            <Text style={tw`text-white/80 text-sm mt-3`}>
              It is quick and easy to log in. Enter your email and password
              below.
            </Text>
          </View>
        </View>
      </View>
      {/* Login From  */}
      <View
        style={tw`bg-white flex-1  px-5 rounded-tl-[37px] rounded-tr-[37px]`}
      >
        <View style={tw`mt-6`}>
          {/* Header Title */}

          {/* Form Fields */}

          <CustomInput<LoginFormInputs>
            name="email"
            label="Email Address"
            control={control as any}
            errors={errors}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            }}
          />

          {/* Password */}
          <PasswordInput<LoginFormInputs>
            name="password"
            label="Password"
            control={control}
            errors={errors}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          {/* Remember Me & Forgot Password Row */}
          <View style={tw`gap-4 flex flex-row justify-end `}>
            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/email-verify");
              }}
            >
              <Text style={tw`text-sm font-semibold text-[#5A7314]`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            {/* <View style={tw`flex-row items-center justify-between mt-1`}>
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { onChange, value } }) => (
                  <Pressable
                    onPress={() => onChange(!value)}
                    style={tw`flex-row items-center`}
                  >
                    <View
                      style={tw`w-5 h-5 rounded border ${
                        value
                          ? "bg-[#5A7314] border-[#5A7314]"
                          : "border-gray-300 bg-white"
                      } items-center justify-center mr-2`}
                    >
                      {value && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                    </View>
                    <Text style={tw`text-sm text-gray-600`}>Remember me</Text>
                  </Pressable>
                )}
              />
            </View> */}
          </View>
        </View>

        {/* Submit Section */}
        <View style={tw`gap-4 mt-7`}>
          <Button
            onPress={handleSubmit(onSubmit)}
            text="Sign In"
            isLoading={isLoading}
          />

          {/* or continue with */}

          <View style={tw` mt-7 flex-row items-center justify-center gap-x-2 `}>
            <Text style={tw`flex-1 h-[1px] bg-[#D2D2D2]`}></Text>
            <Text style={tw` text-[#AEAEAE] text-sm `}>or continue with</Text>
            <Text style={tw`flex-1 h-[1px] bg-[#D2D2D2]`}></Text>
          </View>

          {/* Login With Social Media Buttons */}
          <View style={tw`flex-row justify-center items-center gap-x-4 mt-6`}>
            <TouchableOpacity
              style={tw` flex flex-row items-center justify-center gap-x-1.5 border border-[#D2D2D2]   w-full  py-3.5 rounded-[8px] `}
              onPress={handleGoogleLogin}
            >
              <SvgXml xml={googleIcon} width={18} height={18} />
              <Text
                style={tw`text-sm font-Manrope-Medium.ttf text-center text-[#969696]`}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={tw`flex-row justify-center items-center gap-1 mt-4  `}>
            <Text style={tw`text-sm text-gray-500`}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/Registration");
              }}
            >
              <Text style={tw`text-sm font-bold text-[#5A7314]`}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
