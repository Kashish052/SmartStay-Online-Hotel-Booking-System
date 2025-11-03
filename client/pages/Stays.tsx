import { MainLayout } from "@/components/MainLayout";
import { HotelSearchBar } from "@/components/HotelSearchBar";
import { BookingModal } from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  MapPin,
  Wifi,
  Dumbbell,
  Waves,
  Utensils,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Mock hotel data for search results
const HOTELS_DATA = [
  {
    id: 1,
    name: "Oceanview Paradise Resort",
    location: "Maldives",
    rating: 4.9,
    reviews: 2341,
    price: 299,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1723574081485-f3681844d703?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1096",
    amenities: ["Wifi", "Pool", "Spa", "Restaurant"],
    description: "Luxury beachfront resort with world-class amenities",
  },
  {
    id: 2,
    name: "Mountain Retreat Hotel",
    location: "Swiss Alps",
    rating: 4.8,
    reviews: 1823,
    price: 249,
    originalPrice: 349,
    image:
      "https://images.unsplash.com/photo-1716225589439-5aa87316b235?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsJTIwc3dpc3MlMjBhbHBzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Gym", "Restaurant"],
    description: "Alpine luxury with breathtaking mountain views",
  },
  {
    id: 3,
    name: "Urban Luxury Suite Hotel",
    location: "New York",
    rating: 4.7,
    reviews: 3156,
    price: 399,
    originalPrice: 499,
    image:
      "https://images.unsplash.com/photo-1669511716220-714aa6bb6017?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGx1eHVyeSUyMGhvdGVsJTIwaW4lMjBuZXclMjB5b3JrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Gym", "Restaurant", "Spa"],
    description: "Premium downtown location with modern architecture",
  },
  {
    id: 4,
    name: "Desert Palace Hotel",
    location: "Dubai",
    rating: 4.9,
    reviews: 2567,
    price: 329,
    originalPrice: 429,
    image:
      "https://images.unsplash.com/photo-1641049542858-039c5f434f7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzZXJ0JTIwcGFsYWNlJTIwZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Beach", "Pool", "Spa"],
    description: "Iconic luxury hotel with Arabian elegance",
  },
  {
    id: 5,
    name: "Garden City Boutique",
    location: "Tokyo",
    rating: 4.6,
    reviews: 892,
    price: 189,
    originalPrice: 279,
    image:
      "https://images.unsplash.com/photo-1531068916221-a380a3e2d115?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9reW8lMjBob3RlbHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Gym", "Restaurant"],
    description: "Charming boutique hotel in historic district",
  },
  {
    id: 6,
    name: "Tropical Paradise Villa",
    location: "Bali",
    rating: 4.8,
    reviews: 1456,
    price: 179,
    originalPrice: 269,
    image:
      "https://plus.unsplash.com/premium_photo-1738099065422-27cd35c59b60?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjBpbiUyMGJhbGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    amenities: ["Pool", "Spa", "Restaurant"],
    description: "Exotic beachside resort with lush gardens",
  },
];

const PRICE_RANGES = ["Under $100", "$100 - $250", "$250 - $500", "$500+"];
const RATINGS = [4.5, 4, 3.5, 3];

const AMENITY_ICONS = {
  Wifi: <Wifi className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  Spa: <Utensils className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  Restaurant: <Utensils className="w-4 h-4" />,
  Beach: <Waves className="w-4 h-4" />,
};

export default function Stays() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [hoveredHotel, setHoveredHotel] = useState<number | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<
    (typeof HOTELS_DATA)[0] | null
  >(null);

  const destination = searchParams.get("destination") || "Worldwide";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  // Filter hotels
  let filtered = HOTELS_DATA;

  if (selectedPrice) {
    filtered = filtered.filter((hotel) => {
      if (selectedPrice === "Under $100") return hotel.price < 100;
      if (selectedPrice === "$100 - $250")
        return hotel.price >= 100 && hotel.price <= 250;
      if (selectedPrice === "$250 - $500")
        return hotel.price > 250 && hotel.price <= 500;
      if (selectedPrice === "$500+") return hotel.price > 500;
      return true;
    });
  }

  if (selectedRating) {
    filtered = filtered.filter((hotel) => hotel.rating >= selectedRating);
  }

  // Sort hotels
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleSearch = (data: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    const params = new URLSearchParams();
    if (data.destination) params.set("destination", data.destination);
    if (data.checkIn) params.set("checkIn", data.checkIn);
    if (data.checkOut) params.set("checkOut", data.checkOut);
    params.set("guests", data.guests.toString());
    window.location.search = params.toString();
  };

  return (
    <MainLayout>
      {/* Search Bar Sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="container-lg py-4">
          <HotelSearchBar onSearch={handleSearch} variant="compact" />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container-lg">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {destination}
              </h1>
              <p className="text-foreground/60">
                {checkIn || checkOut ? (
                  <>
                    {checkIn} to {checkOut}{" "}
                    {guests && `• ${guests} guest${guests !== "1" ? "s" : ""}`}{" "}
                    • {sorted.length} properties found
                  </>
                ) : (
                  `${sorted.length} properties available`
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative hidden md:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-10 text-sm font-medium text-foreground cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-foreground/60" />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-border p-6 sticky top-32">
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-foreground mb-4">
                      Price Range
                    </h4>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range) => (
                        <label
                          key={range}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="price"
                            value={range}
                            checked={selectedPrice === range}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="w-4 h-4 rounded-full border-border accent-primary cursor-pointer"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                            {range}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">
                      Rating
                    </h4>
                    <div className="space-y-2">
                      {RATINGS.map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={selectedRating === rating}
                            onChange={(e) =>
                              setSelectedRating(parseFloat(e.target.value))
                            }
                            className="w-4 h-4 rounded-full border-border accent-primary cursor-pointer"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(rating)
                                    ? "fill-accent text-accent"
                                    : "text-border"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-foreground/60 ml-2">
                              {rating}+
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedPrice || selectedRating) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-6"
                      onClick={() => {
                        setSelectedPrice(null);
                        setSelectedRating(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Hotel Cards */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {sorted.length > 0 ? (
                <div className="space-y-4">
                  {sorted.map((hotel) => (
                    <div
                      key={hotel.id}
                      onMouseEnter={() => setHoveredHotel(hotel.id)}
                      onMouseLeave={() => setHoveredHotel(null)}
                      className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-elevation-3 overflow-hidden transition-all duration-300 flex flex-col md:flex-row"
                    >
                      {/* Image */}
                      <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-muted">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                          <Heart className="w-5 h-5 text-primary" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                                <MapPin className="w-4 h-4" />
                                {hotel.location}
                              </div>
                              <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                                {hotel.name}
                              </h3>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-foreground/60 mb-4">
                            {hotel.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="font-semibold text-foreground">
                                {hotel.rating}
                              </span>
                            </div>
                            <span className="text-sm text-foreground/60">
                              ({hotel.reviews} reviews)
                            </span>
                          </div>

                          {/* Amenities */}
                          <div className="flex gap-2 flex-wrap">
                            {hotel.amenities.map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-lg"
                              >
                                {AMENITY_ICONS[
                                  amenity as keyof typeof AMENITY_ICONS
                                ] || null}
                                {amenity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="bg-card px-6 py-6 md:py-0 md:border-l border-border flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          {hotel.originalPrice > hotel.price && (
                            <p className="text-sm text-foreground/60 line-through">
                              ${hotel.originalPrice}
                            </p>
                          )}
                          <p className="text-3xl font-bold text-foreground">
                            ${hotel.price}
                          </p>
                          <p className="text-sm text-foreground/60">
                            per night
                          </p>
                        </div>
                        <Button
                          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setBookingModalOpen(true);
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-foreground/60 mb-4">
                    No hotels found matching your filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPrice(null);
                      setSelectedRating(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedHotel && (
        <BookingModal
          hotel={{
            id: selectedHotel.id,
            name: selectedHotel.name,
            location: selectedHotel.location,
            price: selectedHotel.price,
            image: selectedHotel.image,
          }}
          checkIn={searchParams.get("checkIn") || ""}
          checkOut={searchParams.get("checkOut") || ""}
          guests={parseInt(searchParams.get("guests") || "1")}
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedHotel(null);
          }}
        />
      )}
    </MainLayout>
  );
}
