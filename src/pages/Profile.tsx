import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3, Plus, LogOut, X, ShieldCheck, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const addresses = [
    { id: 1, label: "Home", isDefault: true, address: "12 Allen Avenue, Ikeja, Lagos" },
    { id: 2, label: "Office", isDefault: false, address: "5 Broad Street, Lagos Island, Lagos" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-[#22C55E] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-[#22C55E] font-semibold hover:bg-slate-50">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
        </motion.div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between font-serif">
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-1 text-[#22C55E] font-medium">
              <Edit3 className="h-4 w-4" /> Edit
            </button>
          </div>
          <div className="space-y-4">
            <InfoCard icon={<User className="text-[#22C55E]" />} label="Full Name" value={user?.name} />
            <InfoCard icon={<Mail className="text-[#22C55E]" />} label="Email" value={user?.email} />
            <InfoCard icon={<Phone className="text-[#22C55E]" />} label="Phone" value="+234 801 234 5678" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between font-serif">
            <h2 className="text-xl font-bold text-slate-900">Delivery Addresses</h2>
            <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-1 text-[#22C55E] font-medium">
              <Plus className="h-4 w-4" /> Add New
            </button>
          </div>
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-slate-50">
                <div className="p-3 bg-white rounded-xl shadow-sm"><MapPin className="h-5 w-5 text-[#22C55E]" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{addr.label}</span>
                    {addr.isDefault && <span className="text-[10px] bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full font-bold uppercase">Default</span>}
                  </div>
                  <p className="text-slate-500 text-sm">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
           <h2 className="text-xl font-bold text-slate-900 font-serif mb-6">Account Settings</h2>
           <button className="w-full flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 rounded-lg"><ShieldCheck className="h-5 w-5 text-[#22C55E]" /></div>
                <span className="font-semibold">Change Password</span>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
           </button>
           <button onClick={logout} className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50/50 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-50 rounded-lg"><LogOut className="h-5 w-5 text-red-500" /></div>
                <span className="font-semibold">Log Out</span>
              </div>
              <ChevronRight className="h-5 w-5 text-red-300" />
           </button>
        </div>
      </main>

      <AnimatePresence>
        {isEditModalOpen && <Modal title="Edit Profile" onClose={() => setIsEditModalOpen(false)}><EditProfileForm user={user} onClose={() => setIsEditModalOpen(false)} /></Modal>}
        {isAddressModalOpen && <Modal title="Add New Address" onClose={() => setIsAddressModalOpen(false)}><AddAddressForm onClose={() => setIsAddressModalOpen(false)} /></Modal>}
      </AnimatePresence>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-50">
    <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"><X className="h-5 w-5 text-slate-400" /></button>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">Update your details below</p>
      {children}
    </motion.div>
  </div>
);

const EditProfileForm = ({ user, onClose }: any) => (
  <form className="space-y-4">
    <div className="space-y-1"><label className="text-sm font-semibold text-slate-700">Full Name</label><input type="text" defaultValue={user?.name} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#22C55E] outline-none" /></div>
    <div className="space-y-1"><label className="text-sm font-semibold text-slate-700">Email</label><input type="email" defaultValue={user?.email} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none opacity-60" disabled /></div>
    <div className="flex gap-3 pt-4"><button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl">Cancel</button><button type="button" className="flex-1 py-4 font-bold text-white bg-[#22C55E] rounded-2xl">Save Changes</button></div>
  </form>
);

const AddAddressForm = ({ onClose }: any) => (
  <form className="space-y-4">
    <input placeholder="Label (e.g. Home, Office)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
    <input placeholder="Street Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
    <div className="flex gap-3"><input placeholder="City" className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" /><input placeholder="State" className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" /></div>
    <div className="flex gap-3 pt-4"><button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl">Cancel</button><button type="button" className="flex-1 py-4 font-bold text-white bg-[#22C55E] rounded-2xl">Add Address</button></div>
  </form>
);

export default Profile;