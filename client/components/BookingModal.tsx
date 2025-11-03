import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BookingModalProps {
  hotel: {
    id: number;
    name: string;
    location: string;
    price: number;
    image: string;
  };
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({
  hotel,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guests: initialGuests,
  isOpen,
  onClose,
}: BookingModalProps) {
  const navigate = useNavigate();
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    checkIn: initialCheckIn || "",
    checkOut: initialCheckOut || "",
    guests: initialGuests || 1,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialRequests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const calculateNights = (): number => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(1, nights);
  };

  const totalPrice = hotel.price * calculateNights();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check authentication
    if (!user || !token) {
      toast.info("Please sign in to complete your booking");
      onClose();
      navigate("/signin");
      return;
    }

    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: hotel.id,
          hotelName: hotel.name,
          hotelLocation: hotel.location,
          hotelPrice: hotel.price,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      toast.success("Booking confirmed! Redirecting to dashboard...");
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create booking";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Complete Your Booking
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Hotel Preview */}
          <div className="mb-6 p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-foreground/60 mb-2">Booking for</p>
            <h3 className="font-bold text-foreground mb-1">{hotel.name}</h3>
            <p className="text-sm text-foreground/60 mb-3">{hotel.location}</p>
            <p className="text-2xl font-bold text-primary">
              ${hotel.price}
              <span className="text-sm text-foreground/60 font-normal">
                /night
              </span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Check-in */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Check In
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-input"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Check Out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-input"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="8"
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-input"
              />
            </div>

            {/* Guest Details */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-4">
                Guest Details
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-input text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-input text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-input text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requests for your stay?"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors bg-input text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">
                  ${hotel.price} × {calculateNights()} night
                  {calculateNights() !== 1 ? "s" : ""}
                </span>
                <span className="font-semibold text-foreground">
                  ${(hotel.price * calculateNights()).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Service fee</span>
                <span className="font-semibold text-foreground">
                  ${(totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">
                  Total Price
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3 border-t border-border">
              <Button
                type="submit"
                disabled={isLoading || isAuthLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={onClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
