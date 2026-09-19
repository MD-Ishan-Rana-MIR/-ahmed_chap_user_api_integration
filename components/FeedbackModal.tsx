import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Keyboard,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import tw from "twrnc";

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; review: string }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = () => {
    onSubmit({ rating, review });
    // Reset fields after submit
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 bg-black/40 justify-end`}>
          {/* Modal Overlay Dismiss Handle */}
          <TouchableOpacity
            style={tw`flex-1`}
            activeOpacity={1}
            onPress={onClose}
          />

          {/* Bottom Sheet Container */}
          <View style={tw`bg-white rounded-t-[32px] px-5 pt-3 pb-8 shadow-2xl`}>
            {/* Top Drag Handle Bar */}
            <View
              style={tw`w-12 h-1 bg-gray-400 rounded-full self-center mb-4`}
            />

            {/* Header Title */}
            <View style={tw`pb-4 border-b border-gray-100 mb-6 items-center`}>
              <Text style={tw`text-base font-bold text-gray-800`}>
                Write A Review
              </Text>
            </View>

            {/* Star Rating Section */}
            <View style={tw`flex-row justify-center items-center gap-4 mb-6`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                  onPress={() => setRating(star)}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#FFC107" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input Section */}
            <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
              What Did You Think?
            </Text>

            <TextInput
              style={tw`bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-xs text-gray-700 h-28 text-start`}
              multiline
              textAlignVertical="top"
              placeholder="Good event overall but the food options were limited and overpriced. The music was great though!"
              placeholderTextColor="#9CA3AF"
              value={review}
              onChangeText={setReview}
            />

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              style={tw`bg-[#536A15] py-4 rounded-full items-center justify-center mt-6 shadow-sm`}
            >
              <Text style={tw`text-white font-bold text-sm`}>Rate Now!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
