import { MainLayout } from "@/components/MainLayout";
import { HotelSearchBar } from "@/components/HotelSearchBar";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  MapPin,
  Wifi,
  Utensils,
  Dumbbell,
  Waves,
  ArrowRight,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURED_HOTELS = [
  {
    id: 1,
    name: "Oceanview Paradise",
    location: "Maldives",
    rating: 4.9,
    reviews: 2341,
    price: 299,
    image:
      "https://images.unsplash.com/photo-1723574081485-f3681844d703?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1096",
    amenities: ["Wifi", "Pool", "Spa"],
  },
  {
    id: 2,
    name: "Mountain Retreat",
    location: "Swiss Alps",
    rating: 4.8,
    reviews: 1823,
    price: 249,
    image:
      "https://images.unsplash.com/photo-1716225589439-5aa87316b235?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsJTIwc3dpc3MlMjBhbHBzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Gym", "Restaurant"],
  },
  {
    id: 3,
    name: "Urban Luxury",
    location: "New York",
    rating: 4.7,
    reviews: 3156,
    price: 399,
    image:
      "https://images.unsplash.com/photo-1669511716220-714aa6bb6017?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGx1eHVyeSUyMGhvdGVsJTIwaW4lMjBuZXclMjB5b3JrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Business Center", "Fine Dining"],
  },
  {
    id: 4,
    name: "Desert Palace",
    location: "Dubai",
    rating: 4.9,
    reviews: 2567,
    price: 329,
    image:
      "https://images.unsplash.com/photo-1641049542858-039c5f434f7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzZXJ0JTIwcGFsYWNlJTIwZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    amenities: ["Wifi", "Beach", "Concierge"],
  },
];

const FEATURED_DESTINATIONS = [
  {
    name: "Maldives",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=775",
    hotels: 245,
  },
  {
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
    hotels: 1823,
  },
  {
    name: "Tokyo",
    image:
      "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9reW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    hotels: 1456,
  },
  {
    name: "Bali",
    image:
      "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    hotels: 892,
  },
];

const AMENITY_ICONS = {
  Wifi: <Wifi className="w-5 h-5" />,
  Pool: <Waves className="w-5 h-5" />,
  Spa: <Zap className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Restaurant: <Utensils className="w-5 h-5" />,
};

export default function Index() {
  const navigate = useNavigate();
  const [hoveredHotel, setHoveredHotel] = useState<number | null>(null);

  const handleSearch = (data: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    navigate(
      `/stays?destination=${encodeURIComponent(data.destination)}&checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`,
    );
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 md:pb-0 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48" />
        </div>

        <div className="container-lg relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-12 md:mb-16 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Discover Your Perfect{" "}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Stay
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Book from thousands of hotels worldwide. Get the best deals and
              experiences at your fingertips.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-16 md:mb-24 relative z-20">
            <HotelSearchBar onSearch={handleSearch} variant="hero" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto relative z-10">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                50k+
              </div>
              <p className="text-sm md:text-base text-white/80">Hotels</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                180+
              </div>
              <p className="text-sm md:text-base text-white/80">Countries</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                1M+
              </div>
              <p className="text-sm md:text-base text-white/80">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Explore trending destinations loved by millions of travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DESTINATIONS.map((destination) => (
              <button
                key={destination.name}
                onClick={() =>
                  handleSearch({
                    destination: destination.name,
                    checkIn: "",
                    checkOut: "",
                    guests: 1,
                  })
                }
                className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {destination.hotels} hotels
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container-lg">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Hotels
              </h2>
              <p className="text-foreground/60">
                Handpicked experiences for unforgettable stays
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              asChild
            >
              <button
                onClick={() =>
                  handleSearch({
                    destination: "",
                    checkIn: "",
                    checkOut: "",
                    guests: 1,
                  })
                }
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_HOTELS.map((hotel) => (
              <div
                key={hotel.id}
                onMouseEnter={() => setHoveredHotel(hotel.id)}
                onMouseLeave={() => setHoveredHotel(null)}
                className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-elevation-4 transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {hotel.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">
                        {hotel.rating}
                      </span>
                    </div>
                    <span className="text-sm text-foreground/60">
                      ({hotel.reviews})
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {hotel.amenities.slice(0, 2).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-lg"
                      >
                        {AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS] ||
                          null}
                        {amenity}
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-foreground/60">From</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${hotel.price}
                        <span className="text-sm text-foreground/60 font-normal">
                          /night
                        </span>
                      </p>
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      size="sm"
                      asChild
                    >
                      <button>Book</button>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SmartStay?
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Booking",
                description: "Book in seconds with our streamlined process",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Our team is always here to help you",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Verified Reviews",
                description: "Real experiences from real travelers worldwide",
              },
              {
                icon: <Utensils className="w-8 h-8" />,
                title: "Best Deals",
                description:
                  "Guaranteed lowest prices or we refund the difference",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container-lg text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust SmartStay for their hotel
            bookings
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8"
            asChild
          >
            <button
              onClick={() =>
                handleSearch({
                  destination: "",
                  checkIn: "",
                  checkOut: "",
                  guests: 1,
                })
              }
            >
              Explore Hotels <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
