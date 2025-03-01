"use client";
import '../globals.css';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  ChevronDown, 
  Play, 
  SlidersHorizontal 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Mock data for movies
const allMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop",
    rating: 4.8,
    genre: "Sci-Fi",
    duration: "166 min",
    year: 2024,
    price: 5.99
  },
  {
    id: 2,
    title: "Oppenheimer",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.7,
    genre: "Drama",
    duration: "180 min",
    year: 2023,
    price: 4.99
  },
  {
    id: 3,
    title: "The Batman",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    genre: "Action",
    duration: "176 min",
    year: 2022,
    price: 3.99
  },
  {
    id: 4,
    title: "Interstellar: Remastered",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
    rating: 4.9,
    genre: "Sci-Fi",
    duration: "169 min",
    year: 2023,
    price: 4.99
  },
  {
    id: 5,
    title: "The Godfather",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    rating: 4.9,
    genre: "Crime",
    duration: "175 min",
    year: 1972,
    price: 3.99
  },
  {
    id: 6,
    title: "Pulp Fiction",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Crime",
    duration: "154 min",
    year: 1994,
    price: 3.99
  },
  {
    id: 7,
    title: "The Dark Knight",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop",
    rating: 4.9,
    genre: "Action",
    duration: "152 min",
    year: 2008,
    price: 3.99
  },
  {
    id: 8,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "148 min",
    year: 2010,
    price: 3.99
  },
  {
    id: 9,
    title: "Everything Everywhere All at Once",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "139 min",
    year: 2022,
    price: 4.99
  },
  {
    id: 10,
    title: "Parasite",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Thriller",
    duration: "132 min",
    year: 2019,
    price: 3.99
  },
  {
    id: 11,
    title: "The Shawshank Redemption",
    image: "https://images.unsplash.com/photo-1488197047962-b48492212cda?q=80&w=2067&auto=format&fit=crop",
    rating: 4.9,
    genre: "Drama",
    duration: "142 min",
    year: 1994,
    price: 3.99
  },
  {
    id: 12,
    title: "Whiplash",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Drama",
    duration: "106 min",
    year: 2014,
    price: 3.99
  },
  {
    id: 13,
    title: "Avatar: The Way of Water",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop",
    rating: 4.5,
    genre: "Sci-Fi",
    duration: "192 min",
    year: 2022,
    price: 5.99
  },
  {
    id: 14,
    title: "The Matrix Resurrections",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 3.9,
    genre: "Sci-Fi",
    duration: "148 min",
    year: 2021,
    price: 4.99
  },
  {
    id: 15,
    title: "No Time to Die",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.2,
    genre: "Action",
    duration: "163 min",
    year: 2021,
    price: 4.99
  },
  {
    id: 16,
    title: "Top Gun: Maverick",
    image: "https://images.unsplash.com/photo-1608734265656-f035d3e7bcbf?q=80&w=1974&auto=format&fit=crop",
    rating: 4.7,
    genre: "Action",
    duration: "130 min",
    year: 2022,
    price: 4.99
  }
];

// Available genres for filtering
const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western"
];

// Movie Card Component
function MovieCard({ movie }: { movie: any }) {
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`}>
        <Card className="overflow-hidden bg-card border-0 shadow-lg">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={movie.image}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <Button size="sm" variant="secondary" className="gap-1">
                <Play className="h-4 w-4" /> Watch Trailer
              </Button>
            </div>
            <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm">
              {movie.rating} <Star className="h-3 w-3 ml-1 fill-current" />
            </Badge>
            <Badge className="absolute top-2 left-2 bg-accent/80 backdrop-blur-sm">
              ${movie.price}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>{movie.genre}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{movie.duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [yearRange, setYearRange] = useState([1970, 2024]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [movies, setMovies] = useState(allMovies);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [moviesRef, moviesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort movies
  useEffect(() => {
    let filteredMovies = [...allMovies];
    
    if (searchQuery) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedGenre !== "All") {
      filteredMovies = filteredMovies.filter(movie => movie.genre === selectedGenre);
    }
    
    filteredMovies = filteredMovies.filter(movie => 
      movie.price >= priceRange[0] && movie.price <= priceRange[1]
    );
    
    filteredMovies = filteredMovies.filter(movie => 
      movie.year >= yearRange[0] && movie.year <= yearRange[1]
    );
    
    if (ratingFilter > 0) {
      filteredMovies = filteredMovies.filter(movie => movie.rating >= ratingFilter);
    }
    
    switch (sortBy) {
      case "newest":
        filteredMovies.sort((a, b) => b.year - a.year);
        break;
      case "oldest":
        filteredMovies.sort((a, b) => a.year - b.year);
        break;
      case "rating":
        filteredMovies.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filteredMovies.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredMovies.sort((a, b) => b.price - b.price);
        break;
      default:
        break;
    }
    
    setMovies(filteredMovies);
  }, [searchQuery, selectedGenre, sortBy, priceRange, yearRange, ratingFilter]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, movies.length));
  };

  // Skeleton loader for movie cards
  const MovieSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="aspect-[2/3] bg-muted-foreground/20"></div>
        <div className="p-4">
          <div className="h-5 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section with Background Image */}
      <motion.section 
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-muted py-16 min-h-[400px] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2eea8f8c9528?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Browse Our Collection</h1>
          <p className="text-xl mb-8 drop-shadow-md max-w-2xl mx-auto">
            Explore a vast library of movies, from timeless classics to the latest releases. Stream now!
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for movies by title..."
              className="pl-10 py-6 text-lg bg-white/90 text-black placeholder-gray-500 border-none rounded-full shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
      </motion.section>

      {/* Filters and Movies Section */}
      <section className="py-12 flex-1 bg-gradient-to-b from-gray-100 to-white">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-64 lg:w-72 hidden md:block"
            >
              <div className="bg-card rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-6">Filters</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Genre</h3>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
                    <Select 
                      value={ratingFilter.toString()} 
                      onValueChange={(value) => setRatingFilter(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Release Year</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full relative">
                      <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full relative">
                      <div className="absolute inset-y-0 left-1/3 right-1/3 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Mobile Filters */}
            <div className="md:hidden">
              <div className="flex justify-between items-center mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine your movie search
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="genre">
                          <AccordionTrigger>Genre</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {genres.map(genre => (
                                <div key={genre} className="flex items-center">
                                  <Button 
                                    variant={selectedGenre === genre ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedGenre(genre)}
                                  >
                                    {genre}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="rating">
                          <AccordionTrigger>Rating</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {[0, 3, 3.5, 4, 4.5].map(rating => (
                                <div key={rating} className="flex items-center">
                                  <Button 
                                    variant={ratingFilter === rating ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setRatingFilter(rating)}
                                  >
                                    {rating === 0 ? "Any rating" : `${rating}+ Stars`}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="year">
                          <AccordionTrigger>Release Year</AccordionTrigger>
                          <AccordionContent>
                            <div className="px-2">
                              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>{yearRange[0]}</span>
                                <span>{yearRange[1]}</span>
                              </div>
                              <div className="h-1 bg-muted rounded-full relative">
                                <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary rounded-full"></div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="price">
                          <AccordionTrigger>Price Range</AccordionTrigger>
                          <AccordionContent>
                            <div className="px-2">
                              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                              </div>
                              <div className="h-1 bg-muted rounded-full relative">
                                <div className="absolute inset-y-0 left-1/3 right-1/3 bg-primary rounded-full"></div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <Button className="w-full" variant="outline">
                        Reset Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Movies Grid */}
            <div className="flex-1">
              <div className="hidden md:flex justify-between items-center mb-6">
                <div className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{movies.length}</span> movies
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <motion.div 
                ref={moviesRef}
                initial="hidden"
                animate={moviesInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <motion.div key={index} variants={fadeIn}>
                      <MovieSkeleton />
                    </motion.div>
                  ))
                ) : movies.length > 0 ? (
                  movies.slice(0, visibleCount).map((movie) => (
                    <motion.div key={movie.id} variants={fadeIn}>
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedGenre("All");
                        setRatingFilter(0);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </motion.div>
              
              {!isLoading && movies.length > visibleCount && (
                <div className="mt-10 text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={loadMore}
                    className="gap-2"
                  >
                    Load More <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}