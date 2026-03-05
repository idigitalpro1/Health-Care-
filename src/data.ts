export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  availability: string;
  rating: number;
  matchScore: number;
  image: string;
  bodyParts: string[];
  bio: string;
  experience: number;
  education: string;
  languages: string[];
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Miller',
    specialty: 'Orthopedic Surgeon',
    location: 'South Denver Orthopedics',
    availability: 'Available Today',
    rating: 4.9,
    matchScore: 98,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['shoulder', 'elbow', 'wrist', 'hand'],
    bio: 'Dr. Sarah Miller is a board-certified orthopedic surgeon specializing in upper extremity reconstruction. With over 15 years of experience, she has treated thousands of patients with complex shoulder and hand injuries.',
    experience: 15,
    education: 'Harvard Medical School',
    languages: ['English', 'Spanish'],
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    specialty: 'Sports Medicine',
    location: 'Denver Sports Clinic',
    availability: 'Next Available: Tomorrow',
    rating: 4.8,
    matchScore: 95,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['knee', 'ankle', 'foot', 'hip'],
    bio: 'Dr. James Chen is a leading sports medicine specialist who works with professional athletes. He focuses on non-surgical treatments and regenerative medicine to help patients return to their active lifestyles.',
    experience: 12,
    education: 'Stanford University School of Medicine',
    languages: ['English', 'Mandarin'],
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    specialty: 'Neurologist',
    location: 'Rocky Mountain Neurology',
    availability: 'Available in 2 days',
    rating: 4.7,
    matchScore: 92,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['head', 'neck'],
    bio: 'Dr. Emily Davis specializes in treating migraines, concussions, and other neurological conditions affecting the head and neck. She is dedicated to providing compassionate care and personalized treatment plans.',
    experience: 10,
    education: 'Johns Hopkins University School of Medicine',
    languages: ['English'],
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    specialty: 'Physical Therapist',
    location: 'Active Life Therapy',
    availability: 'Available Today',
    rating: 4.9,
    matchScore: 99,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['shoulder', 'knee', 'hip', 'back'],
    bio: 'Dr. Michael Brown is a physical therapist with a passion for helping patients recover from injuries and improve their mobility. He uses a combination of manual therapy and exercise to achieve optimal results.',
    experience: 8,
    education: 'University of Colorado Anschutz Medical Campus',
    languages: ['English', 'French'],
  },
  {
    id: '5',
    name: 'Dr. Lisa Wilson',
    specialty: 'Rheumatologist',
    location: 'Denver Arthritis Center',
    availability: 'Next Available: Monday',
    rating: 4.6,
    matchScore: 88,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['hand', 'wrist', 'knee', 'ankle'],
    bio: 'Dr. Lisa Wilson is an expert in diagnosing and treating autoimmune diseases and arthritis. She is committed to helping her patients manage their conditions and improve their quality of life.',
    experience: 14,
    education: 'Mayo Clinic Alix School of Medicine',
    languages: ['English', 'German'],
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    specialty: 'Spine Specialist',
    location: 'Colorado Spine Institute',
    availability: 'Available in 3 days',
    rating: 4.8,
    matchScore: 94,
    image: 'https://images.unsplash.com/photo-1537368910025-bc008f3416ef?auto=format&fit=crop&q=80&w=300&h=300',
    bodyParts: ['neck', 'back', 'hip'],
    bio: 'Dr. Robert Taylor is a renowned spine surgeon who specializes in minimally invasive procedures. He has a track record of successful outcomes and is dedicated to patient education.',
    experience: 20,
    education: 'University of Pennsylvania Perelman School of Medicine',
    languages: ['English'],
  },
];

export const bodyParts = [
  { id: 'head', label: 'Head & Neck', cx: 200, cy: 50 },
  { id: 'shoulder', label: 'Shoulder', cx: 130, cy: 110 },
  { id: 'elbow', label: 'Elbow', cx: 110, cy: 180 },
  { id: 'wrist', label: 'Wrist & Hand', cx: 90, cy: 240 },
  { id: 'hip', label: 'Hip', cx: 160, cy: 260 },
  { id: 'knee', label: 'Knee', cx: 170, cy: 380 },
  { id: 'ankle', label: 'Ankle & Foot', cx: 180, cy: 480 },
];
