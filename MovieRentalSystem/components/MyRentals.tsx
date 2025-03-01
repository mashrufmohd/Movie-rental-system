"use client";

import { useState } from "react";
import { motion } from "framer-motion"; 
import { Card, CardContent } from "@/components/ui/card";

// Define the type for rental items
interface Rental {
  id: number;
  title: string;
  poster: string;
  rentedOn: string;
}

// Large dataset with more movies
const dummyRentals: Rental[] = [
  { id: 1, title: "Inception", poster: "https://rukminim2.flixcart.com/image/850/1000/juk4gi80/poster/7/y/y/large-newposter8952-wall-poster-a-wallpapers-inception-animated-original-imaf5tgggcfznyfd.jpeg?q=90&crop=false", rentedOn: "2025-02-25" },
  { id: 2, title: "Interstellar", poster: "https://i.etsystatic.com/17257718/r/il/c21874/5074686638/il_570xN.5074686638_c0vd.jpg", rentedOn: "2025-02-20" },
  { id: 3, title: "The Dark Knight Rises", poster: "https://img.posterstore.com/zoom/wb0037-8batman-thedarkknightrises50x70.jpg", rentedOn: "2025-02-18" },
  { id: 4, title: "Avengers: Endgame", poster: "https://i.pinimg.com/originals/0c/4a/8c/0c4a8c6220d5dc9c0a7ad7c128cbb556.jpg", rentedOn: "2025-02-17" },
  { id: 5, title: "Spider-Man: No Way Home", poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg", rentedOn: "2025-02-15" },
  { id: 6, title: "Joker", poster: "https://m.media-amazon.com/images/I/71o1w4Fpk1L._AC_UF1000,1000_QL80_.jpg", rentedOn: "2025-02-12" },
  { id: 7, title: "Tenet", poster: "https://upload.wikimedia.org/wikipedia/en/1/14/Tenet_movie_poster.jpg", rentedOn: "2025-02-10" },
  { id: 8, title: "The Matrix Resurrections", poster: "https://upload.wikimedia.org/wikipedia/en/2/2d/The_Matrix_Resurrections.jpg", rentedOn: "2025-02-08" },
  { id: 9, title: "Dune", poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg", rentedOn: "2025-02-06" },
  { id: 10, title: "Black Panther: Wakanda Forever", poster: "https://upload.wikimedia.org/wikipedia/en/6/62/Black_Panther_Wakanda_Forever_poster.jpg", rentedOn: "2025-02-03" },
  { id: 11, title: "Guardians of the Galaxy Vol. 3", poster: "https://upload.wikimedia.org/wikipedia/en/b/ba/Guardians_of_the_Galaxy_Vol._3_poster.jpg", rentedOn: "2025-02-01" },
  { id: 12, title: "The Batman", poster: "https://upload.wikimedia.org/wikipedia/en/2/2a/The_Batman_%282022_film%29_poster.jpg", rentedOn: "2025-01-30" },
  { id: 13, title: "Doctor Strange in the Multiverse of Madness", poster: "https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg", rentedOn: "2025-01-28" },
  { id: 14, title: "Thor: Love and Thunder", poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Thor_Love_and_Thunder_poster.jpeg", rentedOn: "2025-01-25" },
  { id: 15, title: "Oppenheimer", poster: "https://m.media-amazon.com/images/I/71jpo2kH5ZL._AC_UF1000,1000_QL80_.jpg", rentedOn: "2025-01-20" },
];

const MyRentals = () => {
  const [rentals, setRentals] = useState(dummyRentals);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 pt-24 pb-10 min-h-screen"
    >
      <motion.h1 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-extrabold text-white text-center mb-8"
      >
        🎥 My Rentals
      </motion.h1>

      {rentals.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 text-lg text-center"
        >
          You haven&apos;t rented any movies yet.
        </motion.p>
      ) : (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {rentals.map((movie, index) => (
            <motion.div 
              key={movie.id} 
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900/50 backdrop-blur-lg text-white shadow-lg rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  <motion.img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-72 object-cover rounded-t-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; // Fallback image
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <div className="p-5">
                    <h2 className="text-2xl font-semibold">{movie.title}</h2>
                    <p className="text-gray-400 mt-2">📅 Rented on: {movie.rentedOn}</p>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      Return Movie
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyRentals;
