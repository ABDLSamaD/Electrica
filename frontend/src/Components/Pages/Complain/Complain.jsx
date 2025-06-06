import React, { useState } from "react";
import {
  User2,
  MessageSquare,
  Send,
  Star,
  Clock,
  PenTool as Tools,
  Phone,
  MapPin,
  User,
  Mail,
  MapIcon,
  PenTool,
} from "lucide-react";
import HeaderMain from "../HeaderMain";
import KarigarList from "./KarigarList";
import Miniloader from "../../OtherComponents/Miniloader";

// Mock Karigar data with enhanced details
const karigars = [
  {
    id: 1,
    name: "Rahul Kumar",
    specialty: "Carpenter",
    rating: 4.5,
    experience: "8 years",
    location: "Sector 18, Noida",
    phone: "+91 98765-43210",
    completedJobs: 234,
    availability: "Available Now",
    charges: "Rs 500/hour",
    languages: ["Hindi", "English"],
  },
  {
    id: 2,
    name: "Ahmed Khan",
    specialty: "Electrician",
    rating: 4.8,
    experience: "12 years",
    location: "Indirapuram, Ghaziabad",
    phone: "+91 98765-43211",
    completedJobs: 456,
    availability: "Available from Tomorrow",
    charges: "Rs 600/hour",
    languages: ["English", "Urdu"],
  },
  {
    id: 3,
    name: "Suresh Patel",
    specialty: "Plumber",
    rating: 4.3,
    experience: "6 years",
    location: "Vaishali, Ghaziabad",
    phone: "+91 98765-43212",
    completedJobs: 178,
    availability: "Available Now",
    charges: "Rs 400/hour",
    languages: ["Hindi", "Gujarati"],
  },
  {
    id: 4,
    name: "Rajesh Singh",
    specialty: "Painter",
    rating: 4.6,
    experience: "10 years",
    location: "Dwarka, Delhi",
    phone: "+91 98765-43213",
    completedJobs: 321,
    availability: "Available from Next Week",
    charges: "Rs 450/hour",
    languages: ["Hindi", "English", "Punjabi"],
  },
];

function Complain() {
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const [selectedKarigar, setSelectedKarigar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [urgency, setUrgency] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [complain, setComplain] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplain((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, address, phone, message } = complain;
    // Here you can handle the form submission
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/createcomplain`,
        {
          name,
          email,
          address,
          phone,
          message,
          urgency,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        setLoading(false);
        setComplain([]);
        setUrgency("medium");
        setPreferredDate("");
        setContactNumber("");
        setShowForm(false);
        setSelectedKarigar(null);
      } else {
        alert("DId'nt Submitted Complaint!");
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-1 text-white/80">{rating}</span>
      </div>
    );
  };

  return (
    <>
      <HeaderMain />
      <div className="min-h-screen p-8 relative top-28 mb-36">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-white text-center mb-8">
            Electrician Complaint Portal
          </h1>
          <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
            Select a skilled professional from our verified Craftsman network
            and submit your complaint. We ensure quick resolution and quality
            service.
          </p>

          {!showForm ? (
            <KarigarList
              karigars={karigars}
              setSelectedKarigar={setSelectedKarigar}
              setShowForm={setShowForm}
              renderRatingStars={renderRatingStars}
            />
          ) : (
            <div>
              <div className="flex justify-start sm:items-center gap-4 md:gap-0 flex-col-reverse sm:flex-row sm:justify-between items-start mb-8">
                <h2 className="text-3xl font-semibold text-white">
                  Submit Complaint
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedKarigar(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  ← Back to Karigars
                </button>
              </div>

              {selectedKarigar && (
                <div className="mb-8 p-4 sm:p-6 backdrop-blur-lg bg-white/5 rounded-xl border border-solid border-white/10">
                  <div className="flex items-start md:items-center flex-wrap gap-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <User2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-auto md:flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {selectedKarigar.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p className="text-white/80 flex items-center gap-2">
                          <PenTool className="w-4 h-4" />{" "}
                          {selectedKarigar.specialty}
                        </p>
                        <p className="text-white/80 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> {selectedKarigar.phone}
                        </p>
                        <p className="text-white/80 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />{" "}
                          {selectedKarigar.location}
                        </p>
                        <p className="text-white/80 flex items-center gap-2">
                          <Clock className="w-4 h-4" />{" "}
                          {selectedKarigar.experience}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderRatingStars(selectedKarigar.rating)}
                      <p className="text-white/80 mt-2">
                        {selectedKarigar.charges}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h1 className="text-2xl md:text-4xl text-gray-200 mb-5">
                Add complain
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-col-1 sm:grid-cols-3 gap-2">
                  {/* name */}
                  <div>
                    <label className="block text-white mb-2">Name</label>
                    <div className="relative">
                      <User className="absolute top-3 left-3 w-5 h-5 text-white/60" />
                      <input
                        type="text"
                        value={complain.name}
                        onChange={handleChange}
                        name="name"
                        className="w-full bg-white/5 rounded-lg border border-white/10 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="name"
                        required
                      />
                    </div>
                  </div>
                  {/* email */}
                  <div>
                    <label className="block text-white mb-2">email</label>
                    <div className="relative">
                      <Mail className="absolute top-3 left-3 w-5 h-5 text-white/60" />
                      <input
                        type="text"
                        name="email"
                        value={complain.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 rounded-lg border border-white/10 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="mail@email.com"
                        required
                      />
                    </div>
                  </div>
                  {/* urgency */}
                  <div>
                    <label className="block text-white mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="low" className="bg-slate-900">
                        Low Priority
                      </option>
                      <option value="medium" className="bg-slate-900">
                        Medium Priority
                      </option>
                      <option value="high" className="bg-slate-900">
                        High Priority
                      </option>
                      <option value="emergency" className="bg-slate-900">
                        Emergency
                      </option>
                    </select>
                  </div>
                  {/* phone */}
                  <div>
                    <label className="block text-white mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-3 left-3 w-5 h-5 text-white/60" />
                      <input
                        type="text"
                        name="phone"
                        value={complain.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="+92 3376543210"
                        required
                      />
                    </div>
                  </div>
                  {/* address */}
                  <div>
                    <label className="block text-white mb-2">Address</label>
                    <div className="relative">
                      <MapIcon className="absolute top-3 left-3 w-5 h-5 text-white/60" />
                      <input
                        type="text"
                        name="address"
                        value={complain.address}
                        onChange={handleChange}
                        className="w-full bg-white/5 rounded-lg border border-white/10 p-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="snt lucia usa"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* message */}
                <div>
                  <label className="block text-white mb-2">
                    Complaint Details
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-white/60" />
                    <textarea
                      value={complain.message}
                      name="message"
                      onChange={handleChange}
                      className="w-full h-32 bg-white/5 rounded-lg border border-white/10 p-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Please describe your complaint in detail..."
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-blue-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-lg font-semibold"
                >
                  {!loading && <Send className="w-5 h-5" />}
                  {loading ? <Miniloader /> : "Submit Complaint"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Complain;
