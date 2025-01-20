import { useState } from "react";
import PropTypes from "prop-types";
import { MapPin, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

const ProfileCard = ({ profile, onShowLocation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {profile.name}
            </h3>
            <p className="text-gray-600">{profile.title}</p>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => onShowLocation(profile)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Show on Map
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                Less Info <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                More Info <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50">
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {profile.email}
              </p>
              <p className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {profile.phone}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Description</h4>
              <p className="text-gray-600">{profile.description}</p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    interests: PropTypes.arrayOf(PropTypes.string).isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onShowLocation: PropTypes.func.isRequired,
};

export default ProfileCard;
