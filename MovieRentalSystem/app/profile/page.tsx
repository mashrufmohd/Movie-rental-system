// next/app/profile/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Updated for more animations
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Heart, ShoppingCart, LogOut, Clock, Star, CreditCard, Film, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces (unchanged)
interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  genre: string;
  duration: string;
  year: number;
}

interface Rental {
  id: number;
  movie: Movie;
  rentalDate: string;
  dueDate: string;
  status: "active" | "returned" | "overdue";
}

interface Subscription {
  plan: string;
  expiryDate: string;
  status: "active" | "expired" | "pending";
}

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  joinDate?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export default function ProfilePage() {
  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time updates using polling (or WebSocket in production)
  const fetchRealTimeData = useCallback(async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        setIsLoading(true);
        const [wishlistResponse, rentalsResponse, subscriptionResponse] = await Promise.all([
          fetch(`/api/wishlist?userId=${session.user.id}`),
          fetch(`/api/rentals?userId=${session.user.id}`),
          fetch(`/api/subscription?userId=${session.user.id}`),
        ]);

        if (!wishlistResponse.ok || !rentalsResponse.ok || !subscriptionResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const wishlistData = await wishlistResponse.json();
        const rentalsData = await rentalsResponse.json();
        const subscriptionData = await subscriptionResponse.json();

        setWishlist(wishlistData);
        setRentals(rentalsData);
        setSubscription(subscriptionData);

        // Simulate recent activity with movie-themed messages
        setRecentActivity([
          `Added "${wishlistData[0]?.title}" to your cinema wishlist on ${new Date().toLocaleTimeString()}`,
          `Rented "${rentalsData[0]?.movie.title}" – enjoy the show on ${new Date().toLocaleDateString()}`,
          `Subscription renewed for "${subscriptionData.plan}" until ${new Date(subscriptionData.expiryDate).toLocaleDateString()}`,
        ]);
      } catch (error) {
        setError("Error loading profile data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load profile data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [session, status, toast]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRealTimeData();
      // Polling every 30 seconds for real-time updates
      const interval = setInterval(fetchRealTimeData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchRealTimeData, status]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full max-w-4xl mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/60 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl p-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/20"
        >
          <h1 className="text-4xl font-bold mb-6 text-yellow-500 drop-shadow-lg">🎬 Access Denied</h1>
          <p className="text-gray-300 mb-8 text-lg">Step into the spotlight and sign in to unlock your cinematic profile!</p>
          <Button
            onClick={() => router.push("/api/auth/signin")}
            className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            <User className="mr-3 h-6 w-6" /> Sign In Now
          </Button>
          <p className="text-gray-400 mt-4 text-sm">Don’t miss out on your movie rentals and exclusive perks!</p>
        </motion.div>
      </div>
    );
  }

  if (!session?.user || !session.user.id) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-500 text-xl font-semibold">Session data unavailable. Please sign in again.</p>
      </div>
    );
  }

  const handleUpdateProfile = () => {
    router.push("/profile/settings");
  };

  // Animation variants for cards and components
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-900 via-black/90 to-gray-900 text-white pt-16 lg:pt-20 relative overflow-hidden">
      {/* Cinematic background overlay with subtle film grain effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Hero Section with Cinematic Background */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-black/80 rounded-2xl shadow-2xl border border-yellow-500/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-yellow-500 shadow-lg">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} className="object-cover" />
              <AvatarFallback className="bg-yellow-500 text-black text-2xl">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-yellow-500 drop-shadow-md">{session.user.name || "Cinematic Star"}</h1>
              <p className="text-gray-300 text-lg">Your Movie Journey Begins Here</p>
              <Badge className="bg-yellow-500 text-black mt-2 px-4 py-2 text-sm font-semibold animate-pulse-slow">
                Premium Member
              </Badge>
            </div>
          </div>
        </motion.div>

        <Card className="bg-gray-800/90 backdrop-blur-sm border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="p-6 bg-gradient-to-r from-gray-700 to-black/60">
            <CardTitle className="text-2xl font-bold text-yellow-500 flex items-center gap-3">
              <Film className="h-6 w-6" /> Your Cinematic Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700/80 rounded-2xl p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-lg transition-all hover:bg-yellow-500/20"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-lg transition-all hover:bg-yellow-500/20"
                >
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="rentals"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-lg transition-all hover:bg-yellow-500/20"
                >
                  Rentals
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-lg transition-all hover:bg-yellow-500/20"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                      <CardTitle className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                        <User className="h-5 w-5" /> Personal Details
                      </CardTitle>
                      <CardContent className="mt-2 space-y-2">
                        <p className="text-gray-300">Email: {session.user.email || "N/A"}</p>
                        <p className="text-gray-300">Joined: {session.user.joinDate ? new Date(session.user.joinDate).toLocaleDateString() : "N/A"}</p>
                      </CardContent>
                    </Card>
                    {subscription && (
                      <Card className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                        <CardTitle className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                          <CreditCard className="h-5 w-5" /> Subscription
                        </CardTitle>
                        <CardContent className="mt-2 space-y-2">
                          <p className="text-gray-300">Plan: {subscription.plan}</p>
                          <p className="text-gray-300">Status: {subscription.status} | Expires: {new Date(subscription.expiryDate).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <Card className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                    <CardTitle className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                      <Clock className="h-5 w-5" /> Recent Activity
                    </CardTitle>
                    <CardContent className="mt-2 space-y-2">
                      {recentActivity.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-300">
                          {recentActivity.map((activity, index) => (
                            <li key={index} className="animate-fade-in">
                              {activity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No recent activity. Start renting movies!</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="wishlist" className="mt-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
                  <h3 className="text-2xl font-bold text-yellow-500 flex items-center gap-3">
                    <Heart className="h-6 w-6" /> My Cinema Wishlist
                    <Badge className="bg-yellow-500 text-black px-3 py-1 text-lg font-semibold animate-pulse-slow">
                      {wishlist.length}
                    </Badge>
                  </h3>
                  {wishlist.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-64 bg-gray-700/50 rounded-2xl"
                    >
                      <p className="text-gray-400 text-lg">Your wishlist is empty. Add some blockbuster hits!</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((movie) => (
                        <motion.div
                          key={movie.id}
                          variants={cardVariants}
                          whileHover="hover"
                          className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-500/20"
                        >
                          <Link href={`/movies/${movie.id}`} className="flex flex-col items-start gap-3">
                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="w-full h-64 object-cover rounded-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-white truncate">{movie.title}</h4>
                              <p className="text-sm text-gray-400">{movie.year} | {movie.genre}</p>
                              <p className="text-sm text-yellow-500 flex items-center gap-1">
                                <Star className="h-4 w-4" /> {movie.rating.toFixed(1)}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {wishlist.length > 3 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-yellow-400 hover:text-yellow-300 text-lg font-medium mt-4 inline-block"
                    >
                      <Link href="/wishlist">View All ({wishlist.length}) <Ticket className="inline h-5 w-5" /></Link>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="rentals" className="mt-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
                  <h3 className="text-2xl font-bold text-yellow-500 flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6" /> My Active Rentals
                    <Badge className="bg-yellow-500 text-black px-3 py-1 text-lg font-semibold animate-pulse-slow">
                      {rentals.length}
                    </Badge>
                  </h3>
                  {rentals.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-64 bg-gray-700/50 rounded-2xl"
                    >
                      <p className="text-gray-400 text-lg">No rentals yet. Rent a movie and enjoy the show!</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rentals.map((rental) => (
                        <motion.div
                          key={rental.id}
                          variants={cardVariants}
                          whileHover="hover"
                          className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-500/20"
                        >
                          <Link href={`/movies/${rental.movie.id}`} className="flex flex-col items-start gap-3">
                            <img
                              src={rental.movie.image}
                              alt={rental.movie.title}
                              className="w-full h-64 object-cover rounded-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-white truncate">{rental.movie.title}</h4>
                              <p className="text-sm text-gray-400">
                                Rented: {new Date(rental.rentalDate).toLocaleDateString()} | Due: {new Date(rental.dueDate).toLocaleDateString()}
                              </p>
                              <Badge
                                className={`${
                                  rental.status === "overdue" ? "bg-red-500" :
                                  rental.status === "active" ? "bg-yellow-500" : "bg-green-500"
                                } text-black px-2 py-1 text-sm font-medium`}
                              >
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </Badge>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {rentals.length > 3 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-yellow-400 hover:text-yellow-300 text-lg font-medium mt-4 inline-block"
                    >
                      <Link href="/my-rentals">View All ({rentals.length}) <Ticket className="inline h-5 w-5" /></Link>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
                  <h3 className="text-2xl font-bold text-yellow-500">🎟️ Account Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                      <CardTitle className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                        <User className="h-5 w-5" /> Personal Info
                      </CardTitle>
                      <CardContent className="mt-2 space-y-2">
                        <p className="text-gray-300">Name: {session.user.name || "N/A"}</p>
                        <p className="text-gray-300">Email: {session.user.email || "N/A"}</p>
                        <p className="text-gray-300">Phone: {session.user.phone || "N/A"}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700/80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                      <CardTitle className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> Subscription
                      </CardTitle>
                      <CardContent className="mt-2 space-y-2">
                        {subscription ? (
                          <>
                            <p className="text-gray-300">Plan: {subscription.plan}</p>
                            <p className="text-gray-300">Status: {subscription.status}</p>
                            <p className="text-gray-300">Expires: {new Date(subscription.expiryDate).toLocaleDateString()}</p>
                          </>
                        ) : (
                          <p className="text-gray-400">No subscription active.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <Button
                    onClick={handleUpdateProfile}
                    className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                  >
                    <User className="mr-3 h-6 w-6" /> Update Profile
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-gray-700 to-black/60 p-4 flex justify-between items-center">
            <Button
              onClick={handleUpdateProfile}
              variant="outline"
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 font-medium px-6 py-3 rounded-full transition-all hover:scale-105"
            >
              <User className="mr-2 h-5 w-5" /> Manage Account
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600 font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <LogOut className="mr-2 h-5 w-5" /> Sign Out
            </Button>
            {/* Real-time notification ticker */}
            <motion.div
              className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium animate-marquee"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              New blockbuster releases available – rent now!
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}