export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  category: string;
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

const generateDoctors = (category: string, specialty: string, baseId: number, bodyParts: string[]): Doctor[] => {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `${baseId + i}`,
    name: `Dr. ${['Sarah', 'James', 'Emily', 'Michael', 'Lisa', 'Robert'][i]} ${['Miller', 'Chen', 'Davis', 'Brown', 'Wilson', 'Taylor'][i]}`,
    specialty,
    category,
    location: ['South Denver Clinic', 'Downtown Medical', 'Cherry Creek Health', 'Highlands Hospital', 'Aurora Care Center', 'Centennial Medical'][i],
    availability: ['Available Today', 'Next Available: Tomorrow', 'Available in 2 days', 'Available Today', 'Next Available: Monday', 'Available in 3 days'][i],
    rating: 4.5 + (i % 5) * 0.1,
    matchScore: 90 + i,
    image: [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1537368910025-bc008f3416ef?auto=format&fit=crop&q=80&w=300&h=300'
    ][i],
    bodyParts,
    bio: `Experienced ${specialty} dedicated to providing exceptional patient care.`,
    experience: 10 + i,
    education: 'Medical University',
    languages: ['English', i % 2 === 0 ? 'Spanish' : 'French'],
  }));
};

export const doctors: Doctor[] = [
  ...generateDoctors('cardiology', 'Cardiologist', 100, ['chest']),
  ...generateDoctors('pediatrics', 'Pediatrician', 200, ['head', 'chest', 'abdomen']),
  ...generateDoctors('wellness', 'Wellness Specialist', 300, ['head', 'neck', 'back']),
  ...generateDoctors('orthopedics', 'Orthopedic Surgeon', 400, ['shoulder', 'elbow', 'wrist', 'hand', 'hip', 'knee', 'ankle', 'foot']),
  ...generateDoctors('neurology', 'Neurologist', 500, ['head', 'neck', 'back']),
  ...generateDoctors('primary-care', 'Primary Care Physician', 600, ['head', 'chest', 'abdomen', 'back']),
];

export const bodyParts = [
  { id: 'head', label: 'Cranial & Facial', cx: 200, cy: 50 },
  { id: 'neck', label: 'Cervical Spine', cx: 200, cy: 90 },
  { id: 'shoulder', label: 'Shoulder / Rotator Cuff', cx: 130, cy: 110 },
  { id: 'chest', label: 'Thoracic / Cardiac', cx: 200, cy: 150 },
  { id: 'elbow', label: 'Elbow', cx: 110, cy: 180 },
  { id: 'wrist', label: 'Wrist & Hand', cx: 90, cy: 240 },
  { id: 'back', label: 'Lumbar Spine', cx: 200, cy: 220 },
  { id: 'hip', label: 'Pelvis & Hip', cx: 160, cy: 260 },
  { id: 'knee', label: 'Knee Joint', cx: 170, cy: 380 },
  { id: 'ankle', label: 'Ankle', cx: 180, cy: 480 },
  { id: 'foot', label: 'Foot & Phalanges', cx: 180, cy: 520 },
];
