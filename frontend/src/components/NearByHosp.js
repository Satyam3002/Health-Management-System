import axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader2, MapPin, Star, Clock, Phone, Navigation } from "lucide-react";
import testData from "../testData";
import HospitalDetails from "./Hospitaldetails";
import { motion } from "framer-motion";

export default function NearByHosp() {
  const { loc } = useContext(AppContext);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = "https://maps.gomaps.pro/maps/api/place/nearbysearch/json";
  const params = {
    location: `${loc.latitude},${loc.longitude}`,
    radius: 5000,
    name: "hospital",
    key: "AlzaSyyhcZmisIhkme121qXrEUaSpEsfpWuIcvl",
  };

  async function fetchHosp() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiUrl, { params });
      const apiHospitals = response.data.results || [];

      // Combine API results with predefined hospitals
      const combinedHospitals = [...testData, ...apiHospitals];
      setHospitals(combinedHospitals);
    } catch (err) {
      // setError("Failed to fetch hospitals. Please try again.");
      setHospitals(testData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Section: List of Hospitals */}
      <div className="w-full lg:w-2/5 xl:w-1/3 p-6 overflow-y-auto max-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Hospitals</h2>
          <p className="text-gray-600 mb-6">Discover healthcare facilities near your location</p>
          
          <button
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold 
                       hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            onClick={fetchHosp}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Find Nearby Hospitals
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={hospital.place_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setSelectedHospital(hospital)}
              className={`p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 cursor-pointer transform hover:scale-105
                         ${
                           selectedHospital?.place_id === hospital.place_id
                             ? "ring-2 ring-blue-500 shadow-xl bg-blue-50"
                             : "hover:bg-gray-50"
                         }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src={hospital.icon}
                    alt="Hospital Icon"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                    🏥
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                    {hospital.name}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{hospital.vicinity}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(hospital.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {hospital.rating || "N/A"} ({hospital.user_ratings_total || 0})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-700 text-sm font-medium">Open</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Book Appointment
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Section: Hospital Details */}
      <div className={`w-full lg:w-3/5 xl:w-2/3 p-6 ${selectedHospital ? "block" : "hidden lg:flex lg:items-center lg:justify-center"}`}>
        {selectedHospital ? (
          <HospitalDetails selectedHospital={selectedHospital} />
        ) : (
          <div className="text-center text-gray-500">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Select a Hospital</h3>
            <p>Choose a hospital from the list to view details and book appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}
