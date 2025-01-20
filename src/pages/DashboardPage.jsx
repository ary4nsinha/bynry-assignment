import React, { useState, useEffect } from "react";
import { useProfiles } from "../context/ProfileContext";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  Search,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

const LocationInput = ({ value, onChange }) => {
  const inputRef = React.createRef();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange({
          location: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for location..."
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-sm text-gray-500 mt-1">
        Please select a location from the dropdown suggestions
      </p>
    </div>
  );
};

const DashboardPage = () => {
  const { profiles, loading, error, addProfile, updateProfile, deleteProfile } =
    useProfiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!editedProfile.name) errors.name = "Name is required";
    if (!editedProfile.title) errors.title = "Title is required";
    if (!editedProfile.location) errors.location = "Location is required";
    if (!editedProfile.email) errors.email = "Email is required";
    if (!editedProfile.email?.includes("@"))
      errors.email = "Invalid email format";
    if (!editedProfile.phone) errors.phone = "Phone is required";
    if (!editedProfile.description)
      errors.description = "Description is required";
    return errors;
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (profile) => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await deleteProfile(id);
      } catch (error) {
        console.error("Failed to delete profile:", error);
      }
    }
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editedProfile.id) {
        await updateProfile(editedProfile.id, editedProfile);
      } else {
        await addProfile(editedProfile);
      }
      setIsEditing(false);
      setEditedProfile(null);
      setFormErrors({});
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleNew = () => {
    setEditedProfile({
      name: "",
      title: "",
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&backgroundColor=random`,
      location: "",
      coordinates: { lat: 0, lng: 0 },
      email: "",
      phone: "",
      description: "",
      interests: [],
      skills: [],
    });
    setIsEditing(true);
    setFormErrors({});
  };

  const handleLocationChange = ({ location, coordinates }) => {
    setEditedProfile((prev) => ({
      ...prev,
      location,
      coordinates: coordinates || prev.coordinates,
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage profiles and locations</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Profile
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {filteredProfiles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No profiles match your search criteria.
            </p>
          ) : (
            filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Form or Map */}
        <div className="lg:sticky lg:top-8">
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editedProfile.id ? "Edit Profile" : "New Profile"}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded ${
                      formErrors.name ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={editedProfile.title}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        title: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded ${
                      formErrors.title ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <LocationInput
                    value={editedProfile.location}
                    onChange={handleLocationChange}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        email: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded ${
                      formErrors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Description"
                    value={editedProfile.description}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        description: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded h-24 ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-12rem)]">
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  zoom={3}
                  center={{ lat: 20, lng: 0 }}
                  gestureHandling={"greedy"}
                  className="w-full h-full rounded-lg shadow-lg"
                >
                  {profiles.map((profile) => {
                    if (
                      profile.coordinates &&
                      typeof profile.coordinates.lat === "number" &&
                      typeof profile.coordinates.lng === "number"
                    ) {
                      return (
                        <Marker
                          key={profile.id}
                          position={profile.coordinates}
                          title={profile.name}
                          onClick={() => {
                            console.log("Marker clicked:", profile);
                            setSelectedProfile(profile);
                          }}
                        />
                      );
                    }
                    console.warn(`Invalid coordinates for profile:`, profile);
                    return null;
                  })}

                  {selectedProfile && (
                    <InfoWindow
                      position={selectedProfile.coordinates}
                      onCloseClick={() => setSelectedProfile(null)}
                    >
                      <div className="p-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={selectedProfile.photo}
                            alt={selectedProfile.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {selectedProfile.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selectedProfile.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
