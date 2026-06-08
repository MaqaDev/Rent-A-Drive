import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import {
  getAllBookings,
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} from "../api/api.js";
import { AdminStats } from "../components/AdminStats.jsx";
import { BookingsLog } from "../components/BookingsLog.jsx";
import { FleetManagement } from "../components/FleetManagement.jsx";
import { CarFormModal } from "../components/CarFormModal.jsx";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { FiCalendar, FiBriefcase, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [refreshCarsKey, setRefreshCarsKey] = useState(0);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");

  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState(null);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    transmission: "automatic",
    fuelType: "petrol",
    image: "",
    available: true,
  });

  const {
    data: bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useFetch(() => getAllBookings(), []);

  const fetchCars = async () => {
    setCarsLoading(true);
    try {
      const res = await getAllCars();
      setCars(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load fleet");
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchCars();
  }, [refreshCarsKey, user]);

  const handleOpenEditModal = (car) => {
    setSelectedCar(car);
    setFormData({
      make: car.make || "",
      model: car.model || "",
      year: car.year || "",
      category: car.category || "",
      seats: car.seats || "",
      pricePerDay: car.pricePerDay || "",
      transmission: car.transmission || "auto",
      fuelType: car.fuelType || "petrol",
      mileage: car.mileage || "",
      engineSize: car.engineSize || "",
      fuelConsumption: car.fuelConsumption || "",
      image: car.images?.[0]?.url || "",
      available: car.available !== undefined ? car.available : true,
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedCar(null);
    setFormData({
      make: "",
      model: "",
      year: "",
      pricePerDay: "",
      transmission: "automatic",
      fuelType: "petrol",
      image: "",
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (car) => {
    try {
      await updateCar(car._id, { available: car.available });
      toast.success(
        `${car.make} ${car.model} marked as ${car.available ? "Available" : "Unavailable"}`
      );
      setRefreshCarsKey((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleConfirmDeleteCar = async () => {
    try {
      await deleteCar(carIdToDelete);
      toast.success("Vehicle removed successfully");
      setRefreshCarsKey((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete car");
    } finally {
      setIsDeleteModalOpen(false);
      setCarIdToDelete(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCar) {
        await updateCar(selectedCar._id, formData);
        toast.success("Car specs updated successfully");
      } else {
        await createCar(formData);
        toast.success("New car registered successfully");
      }
      setIsModalOpen(false);
      setRefreshCarsKey((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  if (!user || user.role !== "admin")
    return (
      <div className='min-h-screen flex items-center justify-center text-red-500'>
        Not authorized
      </div>
    );

  const filteredCars = cars.filter((car) => {
    const combinedSpecName = `${car.make} ${car.model}`.toLowerCase();
    return combinedSpecName.includes(adminSearchTerm.toLowerCase());
  });

  const rawBookings = bookings?.data?.data || bookings?.data || bookings || [];

  // Yalnız paid + completed bookinglərin cəmi
  const totalRevenue = rawBookings.reduce(
    (sum, b) =>
      sum +
      (b.paymentStatus === "paid" && b.status === "completed"
        ? b.totalPrice
        : 0),
    0,
  );

  const totalBookings = rawBookings.length;

  const confirmedBookings = rawBookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const pendingBookings = rawBookings.filter(
    (b) => b.status === "pending" || b.status === "return_requested",
  ).length;

  // Paid + completed ride sayı — admin "Complete Ride" düyməsi üçün
  const completedRides = rawBookings.filter(
    (b) => b.paymentStatus === "paid" && b.status === "completed",
  ).length;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-primary'>Admin Dashboard</h1>
          {activeTab === "cars" && (
            <button
              onClick={handleOpenAddModal}
              className='flex items-center gap-2 bg-secondary text-primary font-bold px-5 py-3 rounded-xl hover:bg-accent transition'>
              <FiPlus /> Add New Car
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 cursor-pointer'>
          {/* Total Bookings */}
          <div
            onClick={() => {
              setActiveTab("bookings");
              setBookingStatusFilter("all");
            }}
            className={`p-6 rounded-xl border bg-white shadow-sm transition-all ${bookingStatusFilter === "all" && activeTab === "bookings" ? "ring-2 ring-primary border-transparent" : "hover:shadow-md"}`}>
            <p className='text-sm text-gray-400 font-medium uppercase'>
              Total Bookings
            </p>
            <h3 className='text-3xl font-bold text-primary mt-1'>
              {totalBookings}
            </h3>
          </div>

          {/* Active / Confirmed */}
          <div
            onClick={() => {
              setActiveTab("bookings");
              setBookingStatusFilter("confirmed");
            }}
            className={`p-6 rounded-xl border bg-white shadow-sm transition-all ${bookingStatusFilter === "confirmed" && activeTab === "bookings" ? "ring-2 ring-blue-500 border-transparent" : "hover:shadow-md"}`}>
            <p className='text-sm text-blue-500 font-medium uppercase'>
              Active / Confirmed
            </p>
            <h3 className='text-3xl font-bold text-blue-600 mt-1'>
              {confirmedBookings}
            </h3>
          </div>

          {/* Awaiting Action */}
          <div
            onClick={() => {
              setActiveTab("bookings");
              setBookingStatusFilter("pending");
            }}
            className={`p-6 rounded-xl border bg-white shadow-sm transition-all ${bookingStatusFilter === "pending" && activeTab === "bookings" ? "ring-2 ring-yellow-500 border-transparent" : "hover:shadow-md"}`}>
            <p className='text-sm text-yellow-500 font-medium uppercase'>
              Awaiting Action
            </p>
            <h3 className='text-3xl font-bold text-yellow-600 mt-1'>
              {pendingBookings}
            </h3>
          </div>

          {/* Completed Rides */}
          <div
            onClick={() => {
              setActiveTab("bookings");
              setBookingStatusFilter("completed");
            }}
            className={`p-6 rounded-xl border bg-white shadow-sm transition-all ${bookingStatusFilter === "completed" && activeTab === "bookings" ? "ring-2 ring-green-500 border-transparent" : "hover:shadow-md"}`}>
            <p className='text-sm text-green-500 font-medium uppercase'>
              Completed Rides
            </p>
            <h3 className='text-3xl font-bold text-green-600 mt-1'>
              {completedRides}
            </h3>
          </div>

          {/* Total Revenue */}
          <div className='p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all'>
            <p className='text-sm text-green-500 font-medium uppercase'>
              Total Revenue
            </p>
            <h3 className='text-3xl font-bold text-green-600 mt-1'>
              ${totalRevenue.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Tab Controls */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between border-b mb-6 gap-4'>
          <div className='flex'>
            <button
              onClick={() => {
                setActiveTab("bookings");
                setBookingStatusFilter("all");
              }}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 ${activeTab === "bookings" ? "border-secondary text-secondary" : "text-gray-500"}`}>
              <FiCalendar /> Bookings Log{" "}
              {bookingStatusFilter !== "all" &&
                `(${
                  bookingStatusFilter === "pending"
                    ? "awaiting action"
                    : bookingStatusFilter
                })`}
            </button>
            <button
              onClick={() => {
                setActiveTab("cars");
                setAdminSearchTerm("");
                setBookingStatusFilter("all");
              }}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 ${activeTab === "cars" ? "border-secondary text-secondary" : "text-gray-500"}`}>
              <FiBriefcase /> Manage Fleet
            </button>
          </div>

          {activeTab === "cars" && (
            <SearchBar
              value={adminSearchTerm}
              onChange={setAdminSearchTerm}
              placeholder='Search fleet by name or model...'
              className='w-full md:w-72 mb-2 md:mb-0'
            />
          )}
        </div>

        {/* Content */}
        <div className='bg-white rounded-xl shadow-md border overflow-hidden'>
          {activeTab === "bookings" ? (
            <BookingsLog
              bookings={rawBookings}
              loading={bookingsLoading}
              error={bookingsError}
              statusFilter={bookingStatusFilter}
              setStatusFilter={setBookingStatusFilter}
            />
          ) : (
            <FleetManagement
              cars={filteredCars}
              loading={carsLoading}
              onEdit={handleOpenEditModal}
              onDelete={(id) => {
                setCarIdToDelete(id);
                setIsDeleteModalOpen(true);
              }}
              onToggleAvailable={handleToggleAvailable}
            />
          )}
        </div>
      </div>

      <CarFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        selectedCar={selectedCar}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCarIdToDelete(null);
        }}
        onConfirm={handleConfirmDeleteCar}
      />
    </div>
  );
};
