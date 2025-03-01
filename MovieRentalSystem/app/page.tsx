"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Clock, ChevronRight } from "lucide-react";
import {Navbar} from "@/components/navbar"; // Ensure this matches your export (default or named)

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
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

// Expanded mock data for more movies (adding 4 more to each category)
const newReleases = [
  {
    id: 1,
    title: "Dune: Part Two",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop",
    rating: 4.8,
    genre: "Sci-Fi",
    duration: "166 min",
    year: 2024,
  },
  {
    id: 2,
    title: "Oppenheimer",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.7,
    genre: "Drama",
    duration: "180 min",
    year: 2023,
  },
  {
    id: 3,
    title: "The Batman",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    genre: "Action",
    duration: "176 min",
    year: 2022,
  },
  {
    id: 4,
    title: "Interstellar: Remastered",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
    rating: 4.9,
    genre: "Sci-Fi",
    duration: "169 min",
    year: 2023,
  },
  {
    id: 13,
    title: "Avatar: The Way of Water",
    image: "https://images.unsplash.com/photo-1674574124461-56b38d0bcde2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "192 min",
    year: 2022,
  },
  {
    id: 14,
    title: "Top Gun: Maverick",
    image: "https://images.unsplash.com/photo-1658785572180-0d5f6cd4e21e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Action",
    duration: "130 min",
    year: 2022,
  },
  {
    id: 15,
    title: "Black Panther: Wakanda Forever",
    image: "https://images.unsplash.com/photo-1674574124461-56b38d0bcde2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    genre: "Action",
    duration: "161 min",
    year: 2022,
  },
  {
    id: 22,
    title: "Spider-Man: No Way Home",
    image: "https://images.unsplash.com/photo-1646666144232-47b2c4d7b0c3?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Action",
    duration: "148 min",
    year: 2021,
  },
  {
    id: 23,
    title: "The Avengers: Endgame",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Action",
    duration: "181 min",
    year: 2019,
  },
  {
    id: 24,
    title: "Mission: Impossible – Dead Reckoning",
    image: "https://images.unsplash.com/photo-1658785572180-0d5f6cd4e21e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Action",
    duration: "163 min",
    year: 2023,
  },
  {
    id: 25,
    title: "Barbie",
    image: "https://images.unsplash.com/photo-1696441573038-5a8be5e2b2f2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    genre: "Comedy",
    duration: "114 min",
    year: 2023,
  },
];

const topRated = [
  {
    id: 5,
    title: "The Godfather",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    rating: 4.9,
    genre: "Crime",
    duration: "175 min",
    year: 1972,
  },
  {
    id: 6,
    title: "Pulp Fiction",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Crime",
    duration: "154 min",
    year: 1994,
  },
  {
    id: 7,
    title: "The Dark Knight",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop",
    rating: 4.9,
    genre: "Action",
    duration: "152 min",
    year: 2008,
  },
  {
    id: 8,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "148 min",
    year: 2010,
  },
  {
    id: 16,
    title: "Schindler's List",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Drama",
    duration: "195 min",
    year: 1993,
  },
  {
    id: 17,
    title: "The Lord of the Rings: The Return of the King",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    genre: "Fantasy",
    duration: "201 min",
    year: 2003,
  },
  {
    id: 18,
    title: "Fight Club",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Drama",
    duration: "139 min",
    year: 1999,
  },
  {
    id: 26,
    title: "Forrest Gump",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Drama",
    duration: "142 min",
    year: 1994,
  },
  {
    id: 27,
    title: "Good Will Hunting",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.7,
    genre: "Drama",
    duration: "126 min",
    year: 1997,
  },
  {
    id: 28,
    title: "The Matrix",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "136 min",
    year: 1999,
  },
  {
    id: 29,
    title: "Titanic",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Drama",
    duration: "194 min",
    year: 1997,
  },
];

const recommended = [
  {
    id: 9,
    title: "Everything Everywhere All at Once",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    rating: 4.7,
    genre: "Sci-Fi",
    duration: "139 min",
    year: 2022,
  },
  {
    id: 10,
    title: "Parasite",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Thriller",
    duration: "132 min",
    year: 2019,
  },
  {
    id: 11,
    title: "The Shawshank Redemption",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    genre: "Drama",
    duration: "142 min",
    year: 1994,
  },
  {
    id: 12,
    title: "Whiplash",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Drama",
    duration: "106 min",
    year: 2014,
  },
  {
    id: 19,
    title: "Mad Max: Fury Road",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "Action",
    duration: "120 min",
    year: 2015,
  },
  {
    id: 20,
    title: "The Grand Budapest Hotel",
    image: "https://images.unsplash.com/photo-1543584756-31dc18f1c0ba?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Comedy",
    duration: "99 min",
    year: 2014,
  },
  {
    id: 21,
    title: "Joker",
    image: "https://images.unsplash.com/photo-1571843439987-fdb2d8b4a013?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    genre: "Drama",
    duration: "122 min",
    year: 2019,
  },
  {
    id: 30,
    title: "Inglourious Basterds",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    genre: "War",
    duration: "153 min",
    year: 2009,
  },
  {
    id: 31,
    title: "The Prestige",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Drama",
    duration: "130 min",
    year: 2006,
  },
  {
    id: 32,
    title: "La La Land",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2093&auto=format&fit=crop",
    rating: 4.6,
    genre: "Romance",
    duration: "128 min",
    year: 2016,
  },
  {
    id: 33,
    title: "The Silence of the Lambs",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Thriller",
    duration: "118 min",
    year: 1991,
  },
];

// Movie Card Component
function MovieCard({ movie }: { movie: any }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`}>
        <Card className="overflow-hidden bg-card border-0 shadow-md h-full w-full">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={movie.image}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
              <Button size="sm" variant="secondary" className="gap-1 text-xs">
                <Play className="h-3 w-3" /> Watch Trailer
              </Button>
            </div>
            <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-xs">
              {movie.rating} <Star className="h-3 w-3 ml-1 fill-current" />
            </Badge>
          </div>
          <CardContent className="p-2">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
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

export default function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [genresRef, genresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [visibleMovies, setVisibleMovies] = useState(4); // Initially show 4 movies per category

  const loadMoreMovies = () => {
    setVisibleMovies((prev) => prev + 4); // Increase visible movies by 4
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section - Centered with Animation */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative h-[80vh] flex items-center justify-center text-center"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
        </div>

        <div className="relative z-10 max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Your Cinema Experience, <span className="text-primary">Reimagined</span>
            </h1>
            <p className="text-xl mb-8 text-muted-foreground text-white">
              Stream the latest blockbusters and timeless classics from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/browse">
                  Browse Movies <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/plans">
                  View Plans
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Movies Section */}
      <motion.section
        ref={featuredRef}
        initial="hidden"
        animate={featuredInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <Tabs defaultValue="new" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Movies</h2>
              <TabsList>
                <TabsTrigger value="new">New Releases</TabsTrigger>
                <TabsTrigger value="top">Top Rated</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="new">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {newReleases.slice(0, visibleMovies).map((movie) => (
                  <motion.div key={movie.id} variants={fadeIn}>
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="top">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {topRated.slice(0, visibleMovies).map((movie) => (
                  <motion.div key={movie.id} variants={fadeIn}>
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="recommended">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {recommended.slice(0, visibleMovies).map((movie) => (
                  <motion.div key={movie.id} variants={fadeIn}>
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={loadMoreMovies}
              disabled={visibleMovies >= Math.max(newReleases.length, topRated.length, recommended.length)}
            >
              View More
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Genres Section */}
      <motion.section
        ref={genresRef}
        initial="hidden"
        animate={genresInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Genre</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: "Action", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop" },
              { name: "Comedy", image: "https://images.unsplash.com/photo-1543584756-8f40a802e14f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Drama", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" },
              { name: "Sci-Fi", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop" },
              { name: "Horror", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop" },
              { name: "Romance", image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2093&auto=format&fit=crop" },
              { name: "Thriller", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" },
              { name: "Animation", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2071&auto=format&fit=crop" },
            ].map((genre, index) => (
              <motion.div
                key={genre.name}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-lg aspect-video"
              >
                <Link href={`/browse?genre=${genre.name}`}>
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center">
                    <h3 className="text-white text-xl md:text-2xl font-bold">{genre.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Watching?</h2>
            <p className="text-lg mb-8 opacity-90">
              Sign up now and get 30% off your first month. Cancel anytime.
            </p>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href="/signup">
                Get Started <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}