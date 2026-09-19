
export interface Hotel {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  image: string;
  isFavorite?: boolean;
}
export const POPULAR_HOTELS: Hotel[] = [
  {
    id: "1",
    title: "The Dreamland by Young Villas",
    location: "Kuta, Denpasar, Bali",
    price: "34",
    rating: "4.8",
    isFavorite: true,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Paradise Hotel",
    location: "Kuta, Denpasar, Bali",
    price: "37",
    rating: "4.5",
    isFavorite: false,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
  },
];

export const NEAR_HOTELS: Hotel[] = [
  {
    id: "1",
    title: "Sivana Hotel Boutique",
    location: "Uluwatu, Bali",
    price: "50",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Bingin High Tides",
    location: "Bingin, Uluwatu, Bali",
    price: "48",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Sivana Hotel Boutique",
    location: "Uluwatu, Bali",
    price: "50",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=400&auto=format&fit=crop",
  },
];
