import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Drop and recreate collections
    try {
      await User.collection.drop();
      console.log("Dropped User collection");
    } catch (e) {
      console.log("User collection does not exist yet");
    }

    try {
      await Car.collection.drop();
      console.log("Dropped Car collection");
    } catch (e) {
      console.log("Car collection does not exist yet");
    }

    try {
      await Booking.collection.drop();
      console.log("Dropped Booking collection");
    } catch (e) {
      console.log("Booking collection does not exist yet");
    }

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@rentadrive.com",
      password: "Admin1234!",
      role: "admin",
    });
    await adminUser.save();
    console.log("✓ Admin user created:", adminUser.email);

    // Create test user
    const testUser = new User({
      name: "Test User",
      email: "user@rentadrive.com",
      password: "User1234!",
      role: "user",
    });
    await testUser.save();
    console.log("✓ Test user created:", testUser.email);

    // Create sample cars - batch insert one by one for better error handling
    const cars = [
      {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        category: "sedan",
        transmission: "auto",
        seats: 5,
        pricePerDay: 60,
        images: [],
        available: true,
        features: [
          "Bluetooth",
          "USB Charging",
          "Air Conditioning",
          "Power Windows",
        ],
        rating: 4.5,
        numReviews: 45,
        description: "Comfortable and reliable sedan for everyday driving.",
        location: "Downtown",
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2023,
        category: "sedan",
        transmission: "manual",
        seats: 5,
        pricePerDay: 50,
        images: [],
        available: true,
        features: ["Leather Seats", "Backup Camera", "Navigation System"],
        rating: 4.6,
        numReviews: 52,
        description: "Sporty and fuel-efficient sedan.",
        location: "Downtown",
      },
      {
        make: "Tesla",
        model: "Model 3",
        year: 2023,
        category: "luxury",
        transmission: "auto",
        seats: 5,
        pricePerDay: 150,
        images: [],
        available: true,
        features: ["Autopilot", "Premium Audio", "Electric", "Touchscreen"],
        rating: 4.9,
        numReviews: 89,
        description: "Luxury electric vehicle with cutting-edge technology.",
        location: "Airport",
      },
      {
        make: "Toyota",
        model: "CR-V",
        year: 2023,
        category: "suv",
        transmission: "auto",
        seats: 7,
        pricePerDay: 85,
        images: [],
        available: true,
        features: ["AWD", "Cargo Space", "Touchscreen", "Power Liftgate"],
        rating: 4.7,
        numReviews: 68,
        description: "Spacious SUV perfect for families and road trips.",
        location: "Airport",
      },
      {
        make: "Jeep",
        model: "Wrangler",
        year: 2023,
        category: "suv",
        transmission: "auto",
        seats: 5,
        pricePerDay: 95,
        images: [],
        available: true,
        features: [
          "4WD",
          "Off-road Capability",
          "Removable Top",
          "Leather Seats",
        ],
        rating: 4.8,
        numReviews: 73,
        description: "Adventure-ready SUV for off-road enthusiasts.",
        location: "Downtown",
      },
      {
        make: "BMW",
        model: "7 Series",
        year: 2023,
        category: "luxury",
        transmission: "auto",
        seats: 5,
        pricePerDay: 200,
        images: [],
        available: true,
        features: [
          "Premium Leather",
          "Panoramic Roof",
          "Massage Seats",
          "iDrive",
        ],
        rating: 4.9,
        numReviews: 56,
        description: "Ultimate luxury sedan with premium amenities.",
        location: "Airport",
      },
      {
        make: "Hyundai",
        model: "Elantra",
        year: 2023,
        category: "economy",
        transmission: "auto",
        seats: 5,
        pricePerDay: 40,
        images: [],
        available: true,
        features: ["Fuel Efficient", "Backup Camera", "Bluetooth"],
        rating: 4.4,
        numReviews: 38,
        description: "Budget-friendly economy car for city driving.",
        location: "Downtown",
      },
      {
        make: "Chevrolet",
        model: "Bolt",
        year: 2023,
        category: "economy",
        transmission: "auto",
        seats: 5,
        pricePerDay: 45,
        images: [],
        available: true,
        features: ["Electric", "Fast Charging", "Long Range", "Eco-friendly"],
        rating: 4.5,
        numReviews: 42,
        description: "Affordable electric car with excellent range.",
        location: "Airport",
      },
      {
        make: "Mercedes",
        model: "C-Class",
        year: 2023,
        category: "luxury",
        transmission: "auto",
        seats: 5,
        pricePerDay: 180,
        images: [],
        available: true,
        features: [
          "AMG Sport",
          "Panoramic Roof",
          "Premium Sound",
          "Touchscreen",
        ],
        rating: 4.8,
        numReviews: 64,
        description: "Elegant luxury sedan with superior comfort.",
        location: "Downtown",
      },
      {
        make: "Ford",
        model: "Explorer",
        year: 2023,
        category: "suv",
        transmission: "auto",
        seats: 7,
        pricePerDay: 90,
        images: [],
        available: true,
        features: [
          "3rd Row Seating",
          "Towing Capability",
          "Power Liftgate",
          "Cruise Control",
        ],
        rating: 4.6,
        numReviews: 51,
        description: "Versatile SUV with comfortable seating for families.",
        location: "Airport",
      },
      {
        make: "Audi",
        model: "A6",
        year: 2023,
        category: "luxury",
        transmission: "auto",
        seats: 5,
        pricePerDay: 170,
        images: [],
        available: true,
        features: [
          "Quattro AWD",
          "LED Headlights",
          "Virtual Cockpit",
          "Premium Audio",
        ],
        rating: 4.7,
        numReviews: 47,
        description: "Premium German engineering with cutting-edge technology.",
        location: "Downtown",
      },
      {
        make: "Nissan",
        model: "Altima",
        year: 2023,
        category: "sedan",
        transmission: "auto",
        seats: 5,
        pricePerDay: 55,
        images: [],
        available: true,
        features: [
          "Touchscreen",
          "Backup Camera",
          "Bluetooth",
          "Power Windows",
        ],
        rating: 4.5,
        numReviews: 39,
        description: "Practical sedan with modern features.",
        location: "Airport",
      },
    ];

    let createdCount = 0;
    for (const carData of cars) {
      const car = new Car(carData);
      await car.save();
      createdCount++;
    }

    console.log(`✓ ${createdCount} cars added to database`);

    console.log("\n========== DATABASE SEEDED SUCCESSFULLY ==========");
    console.log("Admin credentials: admin@rentadrive.com / Admin1234!");
    console.log("User credentials: user@rentadrive.com / User1234!");
    console.log("Total cars: " + createdCount);
    console.log("==================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedDatabase();
});
