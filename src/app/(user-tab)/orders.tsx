import { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { FeedbackModal } from "../../../components/FeedbackModal";
import BackButton from "../../../components/ui/BackButton";
import { BusSection } from "../../../components/ui/order/BusSection";
import { CategoryFilter } from "../../../components/ui/order/CategoryFilter";
import { HotelsSection } from "../../../components/ui/order/HotelsSection";
import { ProductsSection } from "../../../components/ui/order/ProductsSection";
import { RestaurantsSection } from "../../../components/ui/order/RestaurantsSection";
import { StatusTabs } from "../../../components/ui/order/StatusTabs";
import {
  CategoryItem,
  CategoryType,
  OrderItem,
  SectionProps,
  TabItem,
  TabStatus,
} from "../../../lib/type";

const CATEGORIES: CategoryItem[] = [
  { id: "products", label: "Products", icon: "bag-handle-outline" },
  { id: "hotels", label: "Hotels", icon: "business-outline" },
  { id: "restaurants", label: "Restaurants", icon: "restaurant-outline" },
  { id: "bus", label: "Bus Tickets", icon: "bus-outline" },
];

const TABS: TabItem[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "1",
    orderId: "#ORD-10421",
    title: "Classic Black Blazer",
    items: "01 Item",
    time: "Today, 2:30 PM",
    price: "$656",
    status: "Completed",
    category: "products",
    tabStatus: "completed",
    imageUri:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    orderId: "#ORD-10421",
    title: "Classic Black Blazer",
    items: "01 Item",
    time: "Today, 2:30 PM",
    price: "$656",
    status: "Active",
    category: "products",
    tabStatus: "active",
    imageUri:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    orderId: "#ORD-10423",
    title: "Grand Luxury Hotel Suite",
    items: "1 Room, 2 Nights",
    time: "Tomorrow, 12:00 PM",
    price: "$320",
    status: "Completed",
    category: "hotels",
    tabStatus: "completed",
    imageUri:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
  },
];

export default function OrderScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("products");
  const [activeTab, setActiveTab] = useState<TabStatus>("active");
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.category === selectedCategory && order.tabStatus === activeTab,
  );

  const getTabCount = (status: TabStatus) => {
    return orders.filter(
      (order) =>
        order.category === selectedCategory && order.tabStatus === status,
    ).length;
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, tabStatus: "cancelled", status: "Cancelled" }
          : ord,
      ),
    );
  };

  const handleTrackOrder = (orderId: string) => {
    console.log("Track order clicked for ID:", orderId);
  };

  const handleOpenFeedback = (orderId: string) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const renderCategoryContent = () => {
    const commonProps: SectionProps = {
      orders: filteredOrders,
      activeTab,
      onCancel: handleCancelOrder,
      onTrack: handleTrackOrder,
      onOpenFeedback: handleOpenFeedback,
    };

    switch (selectedCategory) {
      case "products":
        return <ProductsSection {...commonProps} />;
      case "hotels":
        return <HotelsSection {...commonProps} />;
      case "restaurants":
        return <RestaurantsSection {...commonProps} />;
      case "bus":
        return <BusSection {...commonProps} />;
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

        <StatusTabs
          tabs={TABS}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          getTabCount={getTabCount}
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
