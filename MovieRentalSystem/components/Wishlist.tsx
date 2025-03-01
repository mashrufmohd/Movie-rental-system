"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils"; // Added missing import for cn

// Types
interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  genre: string;
  duration: string;
  year: number;
}

// Custom Image Component with Loading Check
const CustomImage = ({
  src,
  alt,
  className,
  onError,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className || "object-cover", !isLoaded && "opacity-0")}
      onError={onError || ((e) => {
        console.log(`Image failed to load for ${alt}: ${src}`);
        (e.currentTarget as HTMLImageElement).src = "/placeholder-image.jpg"; // Ensure placeholder exists
        setIsLoaded(true); // Render with placeholder
      })}
      onLoad={(e) => {
        setIsLoaded(true);
        onLoad?.(e);
      }}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      loading="lazy"
    />
  );
};

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Expanded Mock Data for All Movies (with verified image URLs)
const allMovies: Movie[] = [
  { id: 1, title: "Finding Nemo", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.7, genre: "Animation", duration: "100 min", year: 2003 },
  { id: 2, title: "Killer Ink", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop", rating: 4.2, genre: "Thriller", duration: "95 min", year: 2015 },
  { id: 3, title: "Cabin Fever", image: "https://images.unsplash.com/photo-1543584756-31dc18f1c0ba?q=80&w=2070&auto=format&fit=crop", rating: 4.0, genre: "Horror", duration: "93 min", year: 2016 },
  { id: 4, title: "Broken Vow", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop", rating: 4.3, genre: "Drama", duration: "110 min", year: 2016 },
  { id: 5, title: "What We Do in the Shadows", image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop", rating: 4.8, genre: "Comedy", duration: "86 min", year: 2014 },
  { id: 6, title: "Dragon", image: "https://images.unsplash.com/photo-1696441573038-5a8be5e2b2f2?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Action", duration: "115 min", year: 2015 },
  { id: 7, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1585951237315-266a920d1d6e?q=80&w=2070&auto=format&fit=crop", rating: 4.9, genre: "Action", duration: "152 min", year: 2008 },
  { id: 8, title: "Inception", image: "https://images.unsplash.com/photo-1622186477895-f0380e1f9920?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Sci-Fi", duration: "148 min", year: 2010 },
  { id: 9, title: "The Grand Budapest Hotel", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Comedy", duration: "99 min", year: 2014 },
  { id: 10, title: "Parasite", image: "https://images.unsplash.com/photo-1594281684305-02b262c78ff2?q=80&w=2070&auto=format&fit=crop", rating: 4.6, genre: "Thriller", duration: "132 min", year: 2019 },
  { id: 11, title: "Dune: Part Two", image: "https://images.unsplash.com/photo-1522869635130-9f4c57e86a40?q=80&w=2070&auto=format&fit=crop", rating: 4.8, genre: "Sci-Fi", duration: "166 min", year: 2024 },
  { id: 12, title: "Barbie", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Comedy", duration: "114 min", year: 2023 },
  { id: 13, title: "The Shawshank Redemption", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2070&auto=format&fit=crop", rating: 4.9, genre: "Drama", duration: "142 min", year: 1994 },
  { id: 14, title: "Spider-Man: Across the Spider-Verse", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2070&auto=format&fit=crop", rating: 4.8, genre: "Animation", duration: "140 min", year: 2023 },
  { id: 15, title: "La La Land", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Romance", duration: "128 min", year: 2016 },
  { id: 16, title: "Avatar", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Sci-Fi", duration: "162 min", year: 2009 },
  { id: 17, title: "Titanic", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2070&auto=format&fit=crop", rating: 4.6, genre: "Romance", duration: "194 min", year: 1997 },
  { id: 18, title: "Mad Max: Fury Road", image: "https://images.unsplash.com/photo-1594281684305-02b262c78ff2?q=80&w=2070&auto=format&fit=crop", rating: 4.6, genre: "Action", duration: "120 min", year: 2015 },
  { id: 19, title: "Pulp Fiction", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", rating: 4.8, genre: "Crime", duration: "154 min", year: 1994 },
  { id: 20, title: "Forrest Gump", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Drama", duration: "142 min", year: 1994 },
  { id: 21, title: "The Matrix", image: "https://images.unsplash.com/photo-1622186477895-f0380e1f9920?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Sci-Fi", duration: "136 min", year: 1999 },
  { id: 22, title: "Jurassic Park", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2070&auto=format&fit=crop", rating: 4.6, genre: "Adventure", duration: "127 min", year: 1993 },
  { id: 23, title: "The Lion King", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.8, genre: "Animation", duration: "88 min", year: 1994 },
  { id: 24, title: "Gladiator", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Action", duration: "155 min", year: 2000 },
  { id: 25, title: "The Godfather", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2070&auto=format&fit=crop", rating: 4.9, genre: "Crime", duration: "175 min", year: 1972 },
  { id: 26, title: "Frozen", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.6, genre: "Animation", duration: "102 min", year: 2013 },
  { id: 27, title: "Black Panther", image: "https://images.unsplash.com/photo-1585951237315-266a920d1d6e?q=80&w=2070&auto=format&fit=crop", rating: 4.7, genre: "Action", duration: "134 min", year: 2018 },
];

// Movie Card Component for Wishlist
function WishlistMovieCard({ movie, onToggle }: { movie: Movie; onToggle: (id: number) => void }) {
  const [isWishlisted, setIsWishlisted] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleToggle = () => {
    setIsWishlisted(!isWishlisted);
    onToggle(movie.id);
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image failed to load for ${movie.title}: ${movie.image}`);
    setIsImageLoaded(true); // Allow rendering with placeholder
    (e.currentTarget as HTMLImageElement).src = "/placeholder-image.jpg";
  };

  // Always render the card, even if the image fails, using a placeholder
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
      whileTap={{ scale: 0.98 }}
      className="w-40 sm:w-44 md:w-48 lg:w-52"
    >
      <Card className="relative overflow-hidden bg-gray-800 border-none rounded-lg shadow-sm h-full transition-all duration-300">
        <Link href={`/movies/${movie.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden">
            <CustomImage
              src={movie.image}
              alt={movie.title}
              className="object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
              <Button size="sm" variant="secondary" className="gap-1 text-xs">
                <Play className="h-3 w-3" /> Trailer
              </Button>
            </div>
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-semibold">
              {movie.rating} <Star className="h-3 w-3 ml-1 fill-current" />
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 p-1 text-red-500 hover:text-red-400 transition-colors"
              onClick={handleToggle}
              aria-label={isWishlisted ? `Remove ${movie.title} from wishlist` : `Add ${movie.title} to wishlist`}
            >
              <ThumbsUp className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </Link>
        <CardContent className="p-2 bg-gray-800">
          <div className="flex flex-col items-start">
            <Link href={`/movies/${movie.id}`}>
              <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-yellow-400 transition-colors">
                {movie.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
              <span>{movie.year}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Wishlist Component
export default function Wishlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState(12); // Start with 12 movies
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Helper function to check if an image loads successfully
  const checkImageLoad = useCallback(async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  // Helper function to get movies with valid, loadable images
  const getMoviesWithValidImages = useCallback(async (moviesList: Movie[]): Promise<Movie[]> => {
    const validMovies: Movie[] = [];
    for (const movie of moviesList) {
      const isImageValid = await checkImageLoad(movie.image);
      if (isImageValid) {
        validMovies.push(movie);
      } else {
        console.log(`Image failed to load for ${movie.title}: ${movie.image}`);
      }
    }
    return validMovies.length > 0 ? validMovies : [
      { id: 7, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.9, genre: "Action", duration: "152 min", year: 2008 },
      { id: 15, title: "La La Land", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Romance", duration: "128 min", year: 2016 },
    ];
  }, [checkImageLoad]);

  // Load wishlist from localStorage on mount, filtering for valid, loadable images, with fallback
  useEffect(() => {
    const loadWishlist = async () => {
      console.log("Loading wishlist from localStorage...");
      const savedMovies = localStorage.getItem("wishlist");
      if (savedMovies) {
        try {
          console.log("Parsed wishlist data:", savedMovies);
          const parsedMovies = JSON.parse(savedMovies) as Movie[];
          // Check which movies have loadable images
          const validMovies = await getMoviesWithValidImages(parsedMovies);
          console.log("Valid movies with loadable images after filtering:", validMovies);
          setMovies(validMovies.length > 0 ? validMovies : await getMoviesWithValidImages(allMovies));
        } catch (error) {
          console.error("Error parsing wishlist from localStorage:", error);
          const fallbackMovies = await getMoviesWithValidImages([
           
            { id: 7, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.9, genre: "Action", duration: "152 min", year: 2008 },
            { id: 15, title: "La La Land", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Romance", duration: "128 min", year: 2016 },
          ]);
          console.log("Falling back to default movies with valid images:", fallbackMovies);
          setMovies(fallbackMovies);
          localStorage.setItem("wishlist", JSON.stringify(fallbackMovies));
        }
      } else {
        console.log("No wishlist found in localStorage, using defaults with valid images.");
        const defaults = await getMoviesWithValidImages(allMovies);
        const fallbackMovies = await getMoviesWithValidImages([
          
          { id: 7, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop", rating: 4.9, genre: "Action", duration: "152 min", year: 2008 },
          { id: 15, title: "La La Land", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", rating: 4.5, genre: "Romance", duration: "128 min", year: 2016 },
        ]);
        setMovies(fallbackMovies.length > 0 ? fallbackMovies : defaults);
        localStorage.setItem("wishlist", JSON.stringify(fallbackMovies.length > 0 ? fallbackMovies : defaults));
      }
    };

    // Initial load
    loadWishlist();

    // Set up storage event listener for real-time updates
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "wishlist") {
        console.log("Wishlist updated via storage event:", e);
        await loadWishlist();
      }
    };

    // Custom event for same-tab updates
    const handleCustomEvent = async () => {
      console.log("Wishlist updated via custom event.");
      await loadWishlist();
    };
    
    window.addEventListener("wishlistUpdated", handleCustomEvent);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("wishlistUpdated", handleCustomEvent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getMoviesWithValidImages]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (movies.length > 0) {
      console.log("Saving wishlist to localStorage:", movies);
      localStorage.setItem("wishlist", JSON.stringify(movies));
    } else {
      console.log("Wishlist is empty, clearing localStorage.");
      localStorage.removeItem("wishlist");
    }
  }, [movies]);

  const loadMoreMovies = () => {
    setVisibleMovies((prev) => Math.min(prev + 6, movies.length));
  };

  const toggleMovie = (id: number) => {
    console.log(`Toggling movie with ID ${id} from wishlist.`);
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-black/90 to-gray-900 text-white">
      <motion.section
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeIn}
        className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 pt-20"
      >
        {/* Header Section */}
        <div className="mb-8 flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            My Cinema Wishlist
            <Badge className="bg-yellow-500 text-black text-sm font-semibold px-2 py-1">{movies.length}</Badge>
          </h2>
        </div>

        {/* Movie Grid or Empty State */}
        {movies.length === 0 ? (
          <div className="text-center py-16">
            <ThumbsUp className="h-10 w-10 text-gray-500 mx-auto mb-4" />
            <p className="text-lg text-gray-400">Your wishlist is empty. Start adding blockbuster hits!</p>
            <Link href="/browse" className="inline-block mt-6">
              <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 text-sm py-2 px-4 rounded-full">
                Explore Movies Now
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-8"
          >
            <AnimatePresence>
              {movies.slice(0, visibleMovies).map((movie) => (
                <WishlistMovieCard
                  key={movie.id}
                  movie={movie}
                  onToggle={toggleMovie}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View More Button */}
        {visibleMovies < movies.length && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMoreMovies}
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 text-sm py-2 px-4 rounded-full"
            >
              Load More
            </Button>
          </div>
        )}

        {/* Debug Info (Temporary for Development) */}
        <div className="mt-4 text-gray-400 text-sm text-center">
          <p>Debug: Movies in state = {movies.length}, Visible = {visibleMovies}</p>
        </div>
      </motion.section>

      {/* Subtle Background Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}