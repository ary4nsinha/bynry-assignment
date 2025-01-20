import { useState } from "react";
import { useProfiles } from "../context/ProfileContext";
import ProfileCard from "../components/ProfileCard";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Search, Loader2 } from "lucide-react";

const HomePage = () => {
  const { profiles, loading, error } = useProfiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowLocation = (profile) => {
    setSelectedProfile(profile);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Profile Explorer</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, location, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">Error loading profiles: {error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onShowLocation={handleShowLocation}
            />
          ))}
          {filteredProfiles.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-8">
              No profiles match your search criteria.
            </p>
          )}
        </div>

        <div className="lg:sticky lg:top-8 h-[calc(100vh-12rem)]">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              zoom={selectedProfile ? 12 : 3}
              center={
                selectedProfile
                  ? selectedProfile.coordinates
                  : { lat: 0, lng: 0 }
              }
              gestureHandling={"greedy"}
              className="w-full h-full rounded-lg shadow-lg"
            >
              {selectedProfile && (
                <Marker
                  position={selectedProfile.coordinates}
                  title={selectedProfile.name}
                />
              )}
            </Map>
          </APIProvider>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
