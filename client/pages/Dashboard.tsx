import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  MapPin,
  DollarSign,
  LogOut,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  hotelName: string;
  hotelLocation: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  guests: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/signin");
    }
  }, [user, isAuthLoading, navigate]);

  // Load user's bookings
  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load bookings");

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (isAuthLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <section className="min-h-screen py-12 bg-background relative">
        {/* Decorative Header Background */}
        <div
          className="absolute top-0 left-0 right-0 h-48 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1200&q=80')",
          }}
        />
        <div className="container-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 relative z-10">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome, {user.firstName}! 👋
              </h1>
              <p className="text-foreground/60">
                Manage your bookings and account settings
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 self-start md:self-center flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-1 bg-white rounded-2xl border border-border p-6">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                Profile Info
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Full Name</p>
                  <p className="font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Email</p>
                  <p className="font-semibold text-foreground break-all">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Phone</p>
                  <p className="font-semibold text-foreground">{user.phone}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
                <p className="text-sm text-foreground/60 mb-2">
                  Total Bookings
                </p>
                <p className="text-4xl font-bold text-primary">
                  {bookings.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20 p-6">
                <p className="text-sm text-foreground/60 mb-2">
                  Confirmed Bookings
                </p>
                <p className="text-4xl font-bold text-secondary">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="bg-white rounded-2xl border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Your Bookings
              </h2>
              <Button
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                asChild
              >
                <a href="/stays">
                  <Plus className="w-4 h-4" />
                  New Booking
                </a>
              </Button>
            </div>

            {isLoadingBookings ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {booking.hotelName}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {booking.hotelLocation}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(
                              booking.checkIn,
                            ).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />$
                            {booking.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-secondary/10 text-secondary"
                              : booking.status === "pending"
                                ? "bg-accent/10 text-accent"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <span className="text-sm text-foreground/60">
                          {booking.guests} guest
                          {booking.guests !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                          title="Cancel booking"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-foreground/60 mb-6">
                  You haven't made any bookings yet
                </p>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <a href="/stays">Start Exploring Hotels</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
