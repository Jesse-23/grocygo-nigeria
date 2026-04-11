import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Pencil, Trash2, Star, Plus,
  Lock, LogOut, ChevronRight, X, Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const sampleAddresses: Address[] = [
  { id: "1", label: "Home", street: "12 Allen Avenue", city: "Ikeja", state: "Lagos", isDefault: true },
  { id: "2", label: "Office", street: "5 Broad Street", city: "Lagos Island", state: "Lagos", isDefault: false },
];

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+234 801 234 5678",
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({ ...personalInfo });
  const [addressForm, setAddressForm] = useState<Omit<Address, "id" | "isDefault">>({
    label: "", street: "", city: "", state: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "", newPassword: "", confirm: "",
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setPersonalInfo((prev) => ({ ...prev, name: user.name, email: user.email }));
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  if (!isAuthenticated) return null;

  const initials = personalInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSavePersonal = () => {
    setPersonalInfo({ ...formData });
    setEditPersonalOpen(false);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? { ...a, ...addressForm } : a))
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: Date.now().toString(), ...addressForm, isDefault: prev.length === 0 },
      ]);
    }
    setAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm({ label: "", street: "", city: "", state: "" });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state });
    setAddressModalOpen(true);
  };

  const openNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({ label: "", street: "", city: "", state: "" });
    setAddressModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <motion.div {...fadeUp} className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-foreground font-['Sora']">{personalInfo.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{personalInfo.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => {
                setFormData({ ...personalInfo });
                setEditProfileOpen(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground font-['Sora']">Personal Information</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/5 gap-1.5"
              onClick={() => {
                setFormData({ ...personalInfo });
                setEditPersonalOpen(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
          <div className="grid gap-4">
            {[
              { icon: User, label: "Full Name", value: personalInfo.name },
              { icon: Mail, label: "Email", value: personalInfo.email },
              { icon: Phone, label: "Phone", value: personalInfo.phone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-muted/40 border border-border/50">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Addresses */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground font-['Sora']">Delivery Addresses</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/5 gap-1.5"
              onClick={openNewAddress}
            >
              <Plus className="h-3.5 w-3.5" /> Add New
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">No saved addresses yet</p>
              <Button size="sm" className="rounded-xl gap-1.5" onClick={openNewAddress}>
                <Plus className="h-3.5 w-3.5" /> Add Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/50 group hover:border-primary/20 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {addr.street}, {addr.city}, {addr.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!addr.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleSetDefault(addr.id)}
                        title="Set as default"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditAddress(addr)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Account Settings */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-foreground font-['Sora'] mb-4">Account Settings</h2>
          <div className="divide-y divide-border">
            <button
              className="flex items-center justify-between w-full py-4 group hover:opacity-80 transition-opacity"
              onClick={() => {
                setPasswordForm({ current: "", newPassword: "", confirm: "" });
                setChangePasswordOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Change Password</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              className="flex items-center justify-between w-full py-4 group hover:opacity-80 transition-opacity"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-medium text-destructive">Log Out</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Sora']">Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPersonalInfo({ ...formData });
                setEditProfileOpen(false);
              }}
              className="rounded-xl"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Info Modal */}
      <Dialog open={editPersonalOpen} onOpenChange={setEditPersonalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Sora']">Edit Personal Information</DialogTitle>
            <DialogDescription>Update your personal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPersonalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSavePersonal} className="rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address Modal */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Sora']">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your delivery address" : "Add a new delivery address"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Label (e.g. Home, Office)</Label>
              <Input
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                className="rounded-xl"
                placeholder="Home"
              />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="rounded-xl"
                placeholder="12 Allen Avenue"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="rounded-xl"
                  placeholder="Ikeja"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="rounded-xl"
                  placeholder="Lagos"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSaveAddress} className="rounded-xl">
              {editingAddress ? "Update" : "Add"} Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-['Sora']">Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => setChangePasswordOpen(false)} className="rounded-xl">Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
