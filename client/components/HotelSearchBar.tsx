import { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface HotelSearchBarProps {
  onSearch?: (data: SearchData) => void;
  variant?: "hero" | "compact";
}

export function HotelSearchBar({
  onSearch,
  variant = "hero",
}: HotelSearchBarProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchData);
  };

  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-lg shadow-elevation-2 p-3 md:p-4"
      >
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Destination */}
          <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Where to?"
              value={searchData.destination}
              onChange={(e) =>
                setSearchData({ ...searchData, destination: e.target.value })
              }
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-foreground/50"
            />
          </div>

          {/* Check-in */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) =>
                setSearchData({ ...searchData, checkIn: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-foreground"
            />
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) =>
                setSearchData({ ...searchData, checkOut: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-foreground"
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input">
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="number"
              min="1"
              max="8"
              value={searchData.guests}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  guests: parseInt(e.target.value),
                })
              }
              className="bg-transparent outline-none text-sm text-foreground w-12"
            />
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-elevation-4 p-6 md:p-8 max-w-4xl w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Destination
          </label>
          <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-3 bg-input hover:border-primary/30 transition-colors">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Where to?"
              value={searchData.destination}
              onChange={(e) =>
                setSearchData({ ...searchData, destination: e.target.value })
              }
              className="bg-transparent outline-none text-base flex-1 text-foreground placeholder:text-foreground/40"
            />
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check In
          </label>
          <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-3 bg-input hover:border-primary/30 transition-colors">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) =>
                setSearchData({ ...searchData, checkIn: e.target.value })
              }
              className="bg-transparent outline-none text-base text-foreground"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Check Out
          </label>
          <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-3 bg-input hover:border-primary/30 transition-colors">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) =>
                setSearchData({ ...searchData, checkOut: e.target.value })
              }
              className="bg-transparent outline-none text-base text-foreground"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Guests
          </label>
          <div className="flex items-center gap-3 border-2 border-border rounded-xl px-4 py-3 bg-input hover:border-primary/30 transition-colors">
            <Users className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="number"
              min="1"
              max="8"
              value={searchData.guests}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  guests: parseInt(e.target.value),
                })
              }
              className="bg-transparent outline-none text-base text-foreground w-full"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
      >
        <Search className="w-5 h-5" />
        Search Hotels
      </Button>
    </form>
  );
}
