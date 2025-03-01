"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion if not already installed
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Film,
  Home,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  Star,
  Trash2,
} from "lucide-react";

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

// Navigation items
const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Browse", href: "/browse", icon: Film },
  { name: "My Rentals", href: "/my-rentals", icon: ShoppingCart },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
];

// Top Rentals data (simulated, replace with API call in production)
const topRentalsMovies: Movie[] = [
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
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Movie[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistDropdownOpen, setIsWishlistDropdownOpen] = useState(false);
  const [isTopRentalsDropdownOpen, setIsTopRentalsDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Load wishlist from localStorage
  const loadWishlist = useCallback(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist) as Movie[];
        setWishlistItems(parsedWishlist.slice(0, 4)); // Show only first 4 items
        setWishlistCount(parsedWishlist.length);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  // Fetch top rentals (simulated, replace with real API call)
  const fetchTopRentals = useCallback(async () => {
    // In production, replace with an API call like: fetch('/api/top-rentals')
    // For now, using hardcoded data
    // const response = await fetch('/api/top-rentals');
    // const data = await response.json();
    // setTopRentalsMovies(data);
  }, []);

  // Set up event listeners for wishlist and top rentals updates
  useEffect(() => {
    loadWishlist();
    fetchTopRentals();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wishlist") {
        loadWishlist();
      }
    };

    const handleCustomEvent = () => loadWishlist();

    window.addEventListener("wishlistUpdated", handleCustomEvent);
    window.addEventListener("storage", handleStorageChange);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("wishlistUpdated", handleCustomEvent);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadWishlist, fetchTopRentals]);

  // Function to remove a movie from wishlist
  const removeFromWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist) as Movie[];
        const updatedWishlist = parsedWishlist.filter(movie => movie.id !== id);
        
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist.slice(0, 4));
        setWishlistCount(updatedWishlist.length);
        
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Handle hover for wishlist and top rentals dropdowns
  const handleWishlistMouseEnter = () => {
    setIsWishlistDropdownOpen(true);
  };

  const handleWishlistMouseLeave = () => {
    setIsWishlistDropdownOpen(false);
  };

  const handleTopRentalsMouseEnter = () => {
    setIsTopRentalsDropdownOpen(true);
  };

  const handleTopRentalsMouseLeave = () => {
    setIsTopRentalsDropdownOpen(false);
  };

  // Animation variants for dropdowns
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -5,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-3">
          <Film className="h-8 w-8 text-yellow-400 animate-pulse-slow" />
          <span className="text-2xl font-extrabold text-white hover:text-yellow-300 transition-colors duration-300">
            CinemaVault
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-1">
            {navItems.map((item) => (
              item.name === "Wishlist" ? (
                <NavigationMenuItem key={item.name}>
                  <div
                    onMouseEnter={handleWishlistMouseEnter}
                    onMouseLeave={handleWishlistMouseLeave}
                    className="relative"
                  >
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-400/20 transition-all duration-200",
                          pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium flex items-center">
                          {item.name}
                          <span className="ml-1 text-[10px] bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        </span>
                      </NavigationMenuLink>
                    </Link>

                    <AnimatePresence>
                      {isWishlistDropdownOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg"
                        >
                          <div className="p-0 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                              <span className="text-white font-medium">Your Wishlist</span>
                              <span className="text-[10px] bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center">
                                {wishlistCount}
                              </span>
                            </div>
                            
                            <div className="max-h-[280px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-700">
                              {wishlistItems.length > 0 ? (
                                wishlistItems.map((movie) => (
                                  <Link 
                                    key={movie.id}
                                    href={`/movies/${movie.id}`}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 transition-colors w-full"
                                  >
                                    <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded">
                                      <img 
                                        src={movie.image} 
                                        alt={movie.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop";
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                                      <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <span>{movie.year}</span>
                                        <span className="flex items-center gap-0.5 text-yellow-500">
                                          <Star className="h-3 w-3 fill-current" />
                                          {movie.rating}
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-gray-700/50"
                                      onClick={(e) => removeFromWishlist(movie.id, e)}
                                      aria-label={`Remove ${movie.title} from wishlist`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                ))
                              ) : (
                                <div className="py-4 px-3 text-center text-gray-400 text-sm">
                                  <span className="flex items-center justify-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500 opacity-50" />
                                    <p>Your wishlist is empty</p>
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-2 bg-gray-800">
                              <Link href="/wishlist" className="w-full">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                                >
                                  View All Wishlist
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-400/20 transition-all duration-200",
                        pathname === item.href && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium flex items-center">
                        {item.name}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            ))}

            {/* Top Rentals Dropdown with Movie Data */}
            <NavigationMenuItem>
              <div
                onMouseEnter={handleTopRentalsMouseEnter}
                onMouseLeave={handleTopRentalsMouseLeave}
                className="relative"
              >
                <NavigationMenuTrigger className="hover:bg-yellow-400/20 transition-all duration-200">
                  <span className="text-sm font-medium">Top Rentals</span>
                </NavigationMenuTrigger>

                <AnimatePresence>
                  {isTopRentalsDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-md shadow-lg"
                    >
                      <div className="p-0 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center">
                          <span className="text-white font-medium">Trending Blockbusters</span>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-700">
                          {topRentalsMovies.length > 0 ? (
                            topRentalsMovies.map((movie) => (
                              <Link
                                key={movie.id}
                                href={`/movies/${movie.id}`}
                                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-800 transition-colors w-full"
                              >
                                <div className="relative h-16 w-10 flex-shrink-0 overflow-hidden rounded">
                                  <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop";
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <span>{movie.year}</span>
                                    <span className="flex items-center gap-0.5 text-yellow-500">
                                      <Star className="h-3 w-3 fill-current" />
                                      {movie.rating.toFixed(1)}
                                    </span>
                                    <span>· {movie.genre}</span>
                                  </div>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="py-4 px-3 text-center text-gray-400 text-sm">
                              <span className="flex items-center justify-center gap-2">
                                <Film className="h-5 w-5 text-yellow-500 opacity-50" />
                                <p>No top rentals available</p>
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2 bg-gray-800">
                          <Link href="/top-rentals" className="w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                            >
                              Explore All Top Rentals
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:flex hidden">
            <Search className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-gray-900">
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md hover:bg-yellow-400/20 transition-colors text-white",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-lg font-medium flex items-center">
                      {item.name}
                      {item.name === "Wishlist" && (
                        <span className="ml-2 text-[10px] bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
                {/* Top Rentals in Mobile */}
                <div className="pl-4 pt-2">
                  <span className="text-sm font-semibold text-gray-300">Top Rentals</span>
                  {topRentalsMovies.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movies/${movie.id}`}
                      className={cn(
                        "block pl-6 py-2 text-sm rounded-md hover:bg-yellow-400/10 transition-colors",
                        pathname === `/movies/${movie.id}` && "bg-accent text-accent-foreground"
                      )}
                    >
                      {movie.title}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}