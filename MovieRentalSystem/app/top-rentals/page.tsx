"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Added missing import for Badge
import Link from "next/link";

// Define the Movie interface (unchanged)
interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  genre: string;
  duration: string;
  year: number;
}

// Categories for filtering top rentals
const categories = [
  { name: "All", value: "all" },
  { name: "Action Hits", value: "action" },
  { name: "Romantic Classics", value: "romance" },
  { name: "Sci-Fi Favorites", value: "sci-fi" },
];

// Simulated top rentals data (replace with API call in production)
const fetchTopRentals = async (category: string = "all"): Promise<Movie[]> => {
  const allMovies: Movie[] = [
    {
      id: 1,
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w500/gE8yWftM0t6G9jeF1acKkI9fsKo.jpg",
      rating: 8.8,
      genre: "Sci-Fi",
      duration: "2h 28m",
      year: 2010,
    },
    {
      id: 2,
      title: "The Dark Knight",
      image: "https://image.tmdb.org/t/p/w500/1hRoyz3tYc7A0QAPDHf5s5G7G.png",
      rating: 9.0,
      genre: "Action",
      duration: "2h 32m",
      year: 2008,
    },
    {
      id: 3,
      title: "Titanic",
      image: "https://image.tmdb.org/t/p/w500/kH8yma9Z62r9W2V2J9o5V7yE5r5.jpg",
      rating: 7.8,
      genre: "Romance",
      duration: "3h 14m",
      year: 1997,
    },
    {
      id: 4,
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      rating: 8.6,
      genre: "Sci-Fi",
      duration: "2h 49m",
      year: 2014,
    },
  ];

  if (category === "all") return allMovies;
  return allMovies.filter(movie => movie.genre.toLowerCase() === category.toLowerCase());
};

export default function TopRentalsPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTopRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchTopRentals(selectedCategory);
      setMovies(data);
    } catch (error) {
      console.error("Error fetching top rentals:", error);
      toast({
        title: "Error",
        description: "Failed to load top rentals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => {
    loadTopRentals();
  }, [loadTopRentals]);

  // Animation variants for movie cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(255, 215, 0, 0.3)", transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-900 via-black/90 to-gray-900 text-white pt-16 lg:pt-20 relative overflow-hidden">
      {/* Subtle film grain background overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <Card className="bg-gray-800/90 backdrop-blur-sm border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="p-6 bg-gradient-to-r from-gray-700 to-black/60 border-b border-yellow-500/20">
            <CardTitle className="text-3xl font-bold text-yellow-500 flex items-center gap-3">
              <Star className="h-7 w-7 animate-pulse-slow" /> Top Blockbusters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Tabs
              defaultValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-gray-700/80 rounded-2xl p-1 shadow-md">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-lg transition-all hover:bg-yellow-500/20 hover:shadow-lg px-4 py-2 text-lg font-medium"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-96 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : movies.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-96 bg-gray-700/50 rounded-3xl p-8"
                  >
                    <p className="text-gray-400 text-xl font-medium flex items-center gap-2">
                      <Film className="h-6 w-6 text-yellow-500 opacity-50" />
                      No top rentals available in this category. Check back later!
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {movies.map((movie) => (
                      <motion.div
                        key={movie.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="bg-gray-700/80 rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-yellow-500/20 overflow-hidden transform transition-all duration-300"
                      >
                        <Link href={`/movies/${movie.id}`} className="flex flex-col items-start gap-4 w-full">
                          <div className="relative w-full h-72 overflow-hidden rounded-2xl">
                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
                              {movie.genre}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <h4 className="text-xl font-semibold text-white truncate">{movie.title}</h4>
                            <p className="text-sm text-gray-400">{movie.year} | {movie.duration}</p>
                            <p className="text-sm text-yellow-500 flex items-center gap-2">
                              <Star className="h-5 w-5 fill-current" /> {movie.rating.toFixed(1)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-gray-700 to-black/60 p-6 flex justify-center border-t border-yellow-500/20">
            <Button
              asChild
              className="bg-yellow-500 text-black hover:bg-yellow-600 font-bold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <Link href="/browse">Discover More Hits</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}