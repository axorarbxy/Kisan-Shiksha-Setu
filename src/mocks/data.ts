import type {
  Experiment,
  Insight,
  Match,
  MentorProfile,
  Observation,
  Placement,
  School,
  User,
} from "@/lib/api/schemas";

const mentorNames = [
  "Asha Patel",
  "Ravi Kumar",
  "Meera Singh",
  "Arjun Desai",
  "Kavita Joshi",
  "Sanjay Verma",
  "Nisha Rao",
  "Rahul Shah",
  "Pooja Nair",
  "Amit Yadav",
  "Divya Reddy",
  "Karan Mehta",
] as const;

export const users: User[] = [
  ...mentorNames.map((name, index) => ({
    id: `mentor-${index + 1}`,
    name,
    email: `mentor${index + 1}@kss.example`,
    role: "mentor" as const,
  })),
  {
    id: "school-user-1",
    name: "Sunita Devi",
    email: "school@kss.example",
    role: "school",
  },
  {
    id: "admin-user-1",
    name: "Program Admin",
    email: "admin@kss.example",
    role: "admin",
  },
  { id: "mentor-demo", name: "Demo Mentor", email: "mentor@kss.test", role: "mentor" },
  { id: "school-demo", name: "Demo School", email: "school@kss.test", role: "school" },
  { id: "admin-demo", name: "Demo Admin", email: "admin@kss.test", role: "admin" },
];

const villages = [
  "Rampur",
  "Nandgaon",
  "Sundarpur",
  "Kheda",
  "Basantpur",
  "Amarpur",
  "Devgaon",
  "Shivpura",
] as const;

export const placements: Placement[] = mentorNames.map((_, index) => ({
  id: `placement-${index + 1}`,
  village: villages[index % villages.length] ?? "Rampur",
  district: ["Jaipur", "Pune", "Nashik", "Indore"][index % 4] ?? "Jaipur",
  state:
    ["Rajasthan", "Maharashtra", "Madhya Pradesh"][index % 3] ?? "Rajasthan",
  startDate: `2026-07-${String((index % 20) + 1).padStart(2, "0")}`,
  endDate: `2026-10-${String((index % 20) + 1).padStart(2, "0")}`,
  status:
    index % 3 === 0 ? "upcoming" : index % 3 === 1 ? "active" : "completed",
}));

export const mentors: MentorProfile[] = mentorNames.map((_, index) => ({
  userId: `mentor-${index + 1}`,
  college:
    ["State Agricultural University", "Rural Development College"][index % 2] ??
    "State Agricultural University",
  year: "Final year",
  rawePlacement: placements[index],
  topics: [
    ["soil health", "kitchen gardens"],
    ["water conservation", "nutrition"],
  ][index % 2] ?? ["soil health"],
  hoursPerWeek: ([1, 3, 5] as const)[index % 3] ?? 1,
}));

export const schools: School[] = villages.map((village, index) => ({
  id: `school-${index + 1}`,
  name: `${village} Government Upper Primary School`,
  village,
  district: ["Jaipur", "Pune", "Nashik", "Indore"][index % 4] ?? "Jaipur",
  studentCount: 48 + index * 7,
  grades: "1–8",
  contactName:
    [
      "Sunita Devi",
      "Mohan Lal",
      "Rekha Sharma",
      "Anil Pawar",
      "Geeta Kumari",
      "Ramesh Patel",
      "Sarla Bai",
      "Vijay Singh",
    ][index] ?? "School Coordinator",
}));

export const matches: Match[] = schools.map((school, index) => ({
  id: `match-${index + 1}`,
  mentorId: `mentor-${index + 1}`,
  schoolId: school.id,
  status:
    index % 3 === 0 ? "pending" : index % 3 === 1 ? "active" : "completed",
  startedAt: `2026-07-${String(index + 1).padStart(2, "0")}`,
}));

const experimentTitles = [
  ["Kitchen garden diversity", "Crop diversity improves dietary variety."],
  ["Mulching and soil moisture", "Organic mulch reduces soil moisture loss."],
  [
    "Seed germination comparison",
    "Local seeds germinate reliably in local conditions.",
  ],
  ["Compost decomposition", "Layered compost improves decomposition speed."],
  ["Drip irrigation trial", "Drip irrigation reduces water use."],
] as const;

export const experiments: Experiment[] = Array.from(
  { length: 15 },
  (_, index) => {
    const [title, hypothesis] = experimentTitles[
      index % experimentTitles.length
    ] ?? ["School garden study", "Hands-on learning supports observation."];
    return {
      id: `experiment-${index + 1}`,
      matchId: `match-${(index % matches.length) + 1}`,
      title: `${title} ${Math.floor(index / experimentTitles.length) + 1}`,
      hypothesis,
      cropOrTopic:
        ["tomato", "soil health", "millets", "compost", "water"][index % 5] ??
        "tomato",
      plotType: index % 2 === 0 ? "family" : "community",
      status:
        index % 3 === 0 ? "draft" : index % 3 === 1 ? "active" : "completed",
      createdAt: `2026-08-${String((index % 28) + 1).padStart(2, "0")}`,
    };
  },
);

export const observations: Observation[] = experiments.flatMap(
  (experiment, experimentIndex) =>
    Array.from({ length: 3 }, (_, observationIndex) => ({
      id: `${experiment.id}-observation-${observationIndex + 1}`,
      experimentId: experiment.id,
      date: `2026-09-${String(observationIndex * 7 + 1).padStart(2, "0")}`,
      metric: "plant height",
      value: 8 + experimentIndex + observationIndex * 3,
      unit: "cm",
      notes: `Week ${observationIndex + 1} observation`,
    })),
);

export const insights: Insight[] = (
  ["school", "district", "program"] as const
).map((scope) => ({
  scope,
  metric: "active experiments",
  series: Array.from({ length: 6 }, (_, index) => ({
    date: `2026-${String(index + 5).padStart(2, "0")}-01`,
    value: 4 + index * (scope === "program" ? 5 : 2),
  })),
}));
