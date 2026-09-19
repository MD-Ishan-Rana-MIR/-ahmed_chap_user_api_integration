import { useChangePasswordMutation } from "@/redux/authApi";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { errorMsg } from "../../../../lib/msg/errorMsg";
import { successMsg } from "../../../../lib/msg/successMsg";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";
import Button from "../../Button";

export default function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation Error States
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Form Validation Handler
  const validateForm = () => {
    let valid = true;
    let newErrors: typeof errors = {};

    // Current Password Validation
    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      valid = false;
    }

    // New Password Validation
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      valid = false;
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "New password cannot be same as current password";
      valid = false;
    }

    // Confirm Password Validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    if (validateForm()) {
      try {
        const res = await changePassword(payload).unwrap();
        if (res) {
          return successMsg(res?.message);
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred.";
        return errorMsg(errorMessage);
      }
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Change Password" showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`bg-white px-5 pt-6 pb-10`}
      >
        <View style={tw`gap-y-5`}>
          {/* Current Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Current Password
            </Text>
            <View
              style={tw`border ${
                errors.currentPassword ? "border-red-500" : "border-gray-100"
              } rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (errors.currentPassword)
                    setErrors((prev) => ({ ...prev, currentPassword: "" }));
                }}
                secureTextEntry={!showCurrent}
                placeholder="*******"
                placeholderTextColor="#9CA3AF"
                style={tw`text-sm text-gray-700 flex-1 p-0`}
              />
              <TouchableOpacity
                onPress={() => setShowCurrent(!showCurrent)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showCurrent ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                {errors.currentPassword}
              </Text>
            )}
          </View>

          {/* New Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              New Password
            </Text>
            <View
              style={tw`border ${
                errors.newPassword ? "border-red-500" : "border-gray-100"
              } rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                secureTextEntry={!showNew}
                placeholder="*******"
                placeholderTextColor="#9CA3AF"
                style={tw`text-sm text-gray-700 flex-1 p-0`}
              />
              <TouchableOpacity
                onPress={() => setShowNew(!showNew)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showNew ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                {errors.newPassword}
              </Text>
            )}
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Confirm Password
            </Text>
            <View
              style={tw`border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-100"
              } rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                secureTextEntry={!showConfirm}
                placeholder="*******"
                placeholderTextColor="#9CA3AF"
                style={tw`text-sm text-gray-700 flex-1 p-0`}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={tw`text-red-500 text-xs mt-1 ml-3`}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          <View style={tw`mt-4`}>
            <Button text="Save" onPress={handleSave} isLoading={isLoading} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
