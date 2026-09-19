import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../../../lib/tailwind";
import BackButton from "../../BackButton";
import Button from "../../Button";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton title="Change Password" showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`bg-white px-5 pt-6 pb-10`}
      >
        <View style={tw`gap-y-6`}>
          {/* Current Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Current Password
            </Text>
            <View
              style={tw`border border-gray-100 rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
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
          </View>

          {/* New Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              New Password
            </Text>
            <View
              style={tw`border border-gray-100 rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
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
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text style={tw`text-xs text-gray-500 mb-2 font-medium`}>
              Confirm Password
            </Text>
            <View
              style={tw`border border-gray-100 rounded-full px-4 py-3 bg-white flex-row justify-between items-center`}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
          </View>

          <View style={tw`mt-6`}>
            <Button text="Save" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
