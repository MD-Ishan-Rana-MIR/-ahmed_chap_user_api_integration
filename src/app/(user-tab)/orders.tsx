import { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { FeedbackModal } from "../../../components/FeedbackModal";
import BackButton from "../../../components/ui/BackButton";
import { BusSection } from "../../../components/ui/order/BusSection";
import { CategoryFilter } from "../../../components/ui/order/CategoryFilter";
import { HotelsSection } from "../../../components/ui/order/HotelsSection";
import ProductsSection from "../../../components/ui/order/ProductsSection";
import { RestaurantsSection } from "../../../components/ui/order/RestaurantsSection";
import {
  CategoryItem,
  CategoryType,
  TabStatus
} from "../../../lib/type";

const CATEGORIES: CategoryItem[] = [
  { id: "products", label: "Products", icon: "bag-handle-outline" },
  { id: "hotels", label: "Hotels", icon: "business-outline" },
  { id: "restaurants", label: "Restaurants", icon: "restaurant-outline" },
  { id: "bus", label: "Bus Tickets", icon: "bus-outline" },
];

export default function OrderScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("products");
  const [activeTab, setActiveTab] = useState<TabStatus>("active");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "products":
        return <ProductsSection status={activeTab} />;
      case "hotels":
        return <HotelsSection />;
      case "restaurants":
        return <RestaurantsSection />;
      case "bus":
        return <BusSection />;
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackButton showBackButton={false} title="Orders" />

      <View style={tw`flex-1 bg-white pt-5`}>
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {renderCategoryContent()}
      </View>

      <FeedbackModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={() => setModalVisible(false)}
      />
    </View>
  );
}
