import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Plus,
  LogOut,
  X,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Trash2, // Added for deleting
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// --- Types ---
interface Address {
  id: number;
  label: string;
  street_address: string;
  city: string;
  state: string;
  is_default: boolean;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("grocygo_token");
      const response = await fetch("http://localhost:5000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const token = localStorage.getItem("grocygo_token");
      const response = await fetch(
        `http://localhost:5000/api/addresses/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        fetchAddresses(); // Refresh the list
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const token = localStorage.getItem("grocygo_token");
      const response = await fetch(
        `http://localhost:5000/api/addresses/${id}/default`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        fetchAddresses(); // Refresh the list
      }
    } catch (error) {
      console.error("Setting default failed:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Top Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-[#22C55E] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-[#22C55E] font-semibold hover:bg-slate-50 transition-all"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
        </motion.div>

        {/* Personal Information */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Personal Information
            </h2>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 text-[#22C55E] font-medium"
            >
              <Edit3 className="h-4 w-4" /> Edit
            </button>
          </div>
          <div className="space-y-4">
            <InfoCard
              icon={<User className="text-[#22C55E]" />}
              label="Full Name"
              value={user?.name}
            />
            <InfoCard
              icon={<Mail className="text-[#22C55E]" />}
              label="Email"
              value={user?.email}
            />
            <InfoCard
              icon={<Phone className="text-[#22C55E]" />}
              label="Phone"
              value={user?.phone || "+234 ..."}
            />
          </div>
        </div>

        {/* Delivery Addresses Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Delivery Addresses
            </h2>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-1 text-[#22C55E] font-medium"
            >
              <Plus className="h-4 w-4" /> Add New
            </button>
          </div>

          <div className="space-y-4">
            {loadingAddresses ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-[#22C55E]" />
              </div>
            ) : addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-slate-50 group hover:border-[#22C55E]/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <MapPin className="h-5 w-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {addr.label}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full font-bold uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">
                        {addr.street_address}, {addr.city}, {addr.state}
                      </p>

                      {!addr.is_default && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="mt-2 text-xs font-bold text-[#22C55E] hover:underline"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-4">
                No addresses saved yet.
              </p>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          <h2 className="text-xl font-bold text-slate-900 font-serif mb-6">
            Account Settings
          </h2>
          <button className="w-full flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
              </div>
              <span className="font-semibold text-slate-700">
                Change Password
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300" />
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50/50 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-white transition-colors">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <span className="font-semibold">Log Out</span>
            </div>
            <ChevronRight className="h-5 w-5 text-red-300" />
          </button>
        </div>
      </main>

      <AnimatePresence>
        {isEditModalOpen && (
          <Modal title="Edit Profile" onClose={() => setIsEditModalOpen(false)}>
            <EditProfileForm
              user={user}
              onClose={() => setIsEditModalOpen(false)}
            />
          </Modal>
        )}
        {isAddressModalOpen && (
          <Modal
            title="Add New Address"
            onClose={() => setIsAddressModalOpen(false)}
          >
            <AddAddressForm
              onClose={() => setIsAddressModalOpen(false)}
              onSuccess={fetchAddresses}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Components ---
const InfoCard = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-50">
    <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {label}
      </p>
      <p className="font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
      >
        <X className="h-5 w-5 text-slate-400" />
      </button>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">Update your details below</p>
      {children}
    </motion.div>
  </div>
);

const EditProfileForm = ({ user, onClose }: any) => {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("grocygo_token");
      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        },
      );
      if (response.ok) {
        updateUser({ name, phone });
        alert("Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 font-bold text-white bg-[#22C55E] rounded-2xl"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

const AddAddressForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("grocygo_token");
      const response = await fetch("http://localhost:5000/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label,
          street_address: street,
          city,
          state,
          is_default: false,
        }),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        placeholder="Label (e.g. Home, Office)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
      />
      <input
        required
        placeholder="Street Address"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
      />
      <div className="grid grid-cols-2 gap-3 w-full">
        <input
          required
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
        <input
          required
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 font-bold text-white bg-[#22C55E] rounded-2xl"
        >
          {loading ? "Adding..." : "Add Address"}
        </button>
      </div>
    </form>
  );
};

export default Profile;
