import { FontAwesome, Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import BackButton from "../../../components/ui/BackButton";
import tw from "../../../lib/tailwind";

interface ProfilePictureUploadProps {
  onAddPicture?: (uri: string) => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  onAddPicture,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Camera roll permissions are needed to select a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
      if (onAddPicture) {
        onAddPicture(selectedUri);
      }
    }
  };

  const handleNavigate = () => {
    router.push("/(user-tab)");
  };

  const onSkip = () => {
    router.push("/(user-tab)");
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top Header */}
      <BackButton title="Profile picture" />

      {/* Main Container */}
      <View style={tw`flex-1 px-5 py-6 justify-between`}>
        {/* Centered Avatar Area */}
        <View style={tw`flex-1 justify-center items-center`}>
          <Pressable onPress={handlePickImage} style={tw`relative`}>
            {/* Orange Outer Ring & Avatar Container */}
            <View
              style={tw`w-40 h-40 rounded-full border-2 border-[#FF6B00] items-center justify-center bg-[#D0D7DE] overflow-hidden`}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome
                  name="user"
                  size={110}
                  color="#FFFFFF"
                  style={tw`mt-6`}
                />
              )}
            </View>

            {/* Edit Pencil Badge */}
            <View
              style={tw`absolute bottom-1 right-1 w-9 h-9 bg-[#FF6B00] rounded-full items-center justify-center border-2 border-white`}
            >
              <Octicons name="pencil" size={16} color="white" />
            </View>
          </Pressable>
        </View>

        {/* Bottom Action Buttons */}
        <View style={tw`w-full gap-4 mb-4`}>
          <Pressable
            onPress={handleNavigate}
            style={tw`w-full bg-[#5A7314] py-4 rounded-full items-center justify-center shadow-sm active:opacity-90`}
          >
            <Text style={tw`text-white text-base font-semibold`}>
              Add Picture
            </Text>
          </Pressable>

          <Pressable onPress={onSkip} style={tw`w-full py-2 items-center`}>
            <Text style={tw`text-[#5A7314] text-base font-medium`}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfilePictureUpload;
