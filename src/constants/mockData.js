export const mockProfiles = [
  {
    id: 1,
    name: "Rahul Srivastava",
    title: "Software Engineer",
    photo:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    location: "Mumbai, Maharashtra",
    coordinates: { lat: 19.076, lng: 72.8777 },
    email: "rahul.srivastava@gmail.com",
    phone: "8390538444",
    description:
      "Full-stack developer with 5 years of experience in React and Node.js",
    interests: ["Coding", "Hiking", "Photography"],
    skills: ["React", "JavaScript", "Python"],
  },
  {
    id: 2,
    name: "Raj Singh",
    title: "UX Designer",
    photo:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede",
    location: "Pune, Maharastra",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    email: "raj.singh@gmail.com",
    phone: "8390538777",
    description: "Creative designer focused on user-centered design principles",
    interests: ["Design", "Travel", "Music"],
    skills: ["Figma", "UI/UX", "Prototyping"],
  },
  {
    id: 3,
    name: "Kavish Desai",
    title: "Product Manager",
    photo:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=ffdfbf",
    location: "Indore, Madhya Pradesh",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    email: "kavish.desai@gmail.com",
    phone: "8390538666",
    description:
      "Product manager specializing in agile methodologies and user-centric development",
    interests: ["Product Strategy", "Team Building", "Innovation"],
    skills: ["Agile", "Product Development", "Team Leadership"],
  },
  {
    id: 4,
    name: "Om Kadam",
    title: "Data Scientist",
    photo:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1f4d9",
    location: "Pune, Maharastra",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    email: "om.kadam@gmail.com",
    phone: "8490538544",
    description:
      "Data scientist with expertise in machine learning and statistical analysis",
    interests: ["AI", "Machine Learning", "Data Analysis"],
    skills: ["Python", "TensorFlow", "SQL"],
  },
];

export const mockAPI = {
  getProfiles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProfiles);
      }, 800);
    });
  },

  getProfileById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profile = mockProfiles.find((p) => p.id === id);
        if (profile) {
          resolve(profile);
        } else {
          reject(new Error("Profile not found"));
        }
      }, 500);
    });
  },

  addProfile: (profile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProfile = {
          ...profile,
          id: mockProfiles.length + 1,
        };
        mockProfiles.push(newProfile);
        resolve(newProfile);
      }, 500);
    });
  },

  updateProfile: (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProfiles.findIndex((p) => p.id === id);
        if (index !== -1) {
          mockProfiles[index] = { ...mockProfiles[index], ...updates };
          resolve(mockProfiles[index]);
        } else {
          reject(new Error("Profile not found"));
        }
      }, 500);
    });
  },

  deleteProfile: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProfiles.findIndex((p) => p.id === id);
        if (index !== -1) {
          mockProfiles.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error("Profile not found"));
        }
      }, 500);
    });
  },
};
