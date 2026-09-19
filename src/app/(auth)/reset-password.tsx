import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../components/ui/BackButton";
import Button from "../../../components/ui/Button";
import tw from "../../../lib/tailwind";

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const onSubmit = (data: ResetPasswordInputs) => {
    // Navigate to login after password update
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={tw`bg-bgOlive flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        {/* Header Section */}
        <View style={tw` relative overflow-hidden h-[218px] mb-1   `}>
          {/* Absolute Decorative Background Image (Top Right) */}
          <Image
            source={require("../../../assets/images/world.png")}
            style={tw`absolute   -right-10 w-[274px] h-[274px] opacity-90`}
            resizeMode="contain"
          />

          {/* Header Content */}
          <View style={tw`z-10 pr-20`}>
            {/* Back Button */}
            <View style={tw``}>
              <BackButton />
            </View>

            {/* Title & Subtitle */}
            <View style={tw`px-5`}>
              <Text style={tw`text-white text-2xl font-semibold mb-1.5`}>
                Set new password
              </Text>
              <Text style={tw`text-white/80 text-sm mt-3`}>
                Please create a new password for your account
              </Text>
            </View>
          </View>
        </View>

        {/* Form Container */}
        <View
          style={tw`bg-white flex-1 px-5 pt-8 rounded-tl-[37px] rounded-tr-[37px]`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={tw`flex-grow justify-between pb-6`}
          >
            <View>
              {/* New Password Field */}
              <View style={tw`mb-5`}>
                <Text style={tw`text-[#757575] text-sm font-normal mb-1.5`}>
                  New Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={tw`flex-row items-center border ${
                        errors.password ? "border-red-500" : "border-[#EDF1F3]"
                      } rounded-full px-4 py-3 bg-white`}
                    >
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="*******"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPassword}
                        style={tw`flex-1 text-base text-gray-800 p-0`}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {/* <Ionicons
                          name={
                            showPassword ? "eye-outline" : "eye-off-outline"
                          }
                          size={20}
                          color="#9CA3AF"
                        /> */}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Confirm Password Field */}
              <View style={tw`mb-5`}>
                <Text style={tw`text-[#757575] text-sm font-normal mb-1.5`}>
                  Confirm Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watchPassword || "Passwords do not match",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={tw`flex-row items-center border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#EDF1F3]"
                      } rounded-full px-4 py-3 bg-white`}
                    >
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="*******"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showConfirmPassword}
                        style={tw`flex-1 text-base text-gray-800 p-0`}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {/* <Ionicons
                          name={
                            showConfirmPassword
                              ? "eye-outline"
                              : "eye-off-outline"
                          }
                          size={20}
                          color="#9CA3AF"
                        /> */}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={tw`text-xs text-red-500 mt-1 ml-2`}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <View style={tw`mt-6`}>
              <Button
                onPress={handleSubmit(onSubmit)}
                text="Continue"
                disabled={isSubmitting}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
