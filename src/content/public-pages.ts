import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  HandHeart,
  Sprout,
  UsersRound,
} from "lucide-react";

export const homeCopy = {
  hero: {
    eyebrow: "Kisan Shiksha Setu",
    headline: "Where fieldwork becomes a classroom.",
    description:
      "Final-year agriculture students mentor rural school children through real experiments on their own family and community farms.",
    primaryAction: "Join the pilot",
    secondaryAction: "See how it works",
    illustrationAlt:
      "Illustration of a sprout growing between a rural school and a bridge",
    illustrationCaption: "Learning rooted in local questions",
  },
  problem: {
    eyebrow: "The opportunity",
    title: "Make practical learning matter to more people.",
    description:
      "Two learning journeys meet around the questions people can see in the fields and communities around them.",
    evidenceLead: "These themes reflect the research summarized in our",
    evidenceLink: "evidence notes",
    evidenceTail: "; they are not claims about measured KSS outcomes.",
  },
  steps: {
    eyebrow: "How it works",
    title: "A small bridge from field to classroom.",
    description:
      "A simple cycle turns existing field experience into shared, local learning.",
    link: "Explore the four steps",
  },
  why: {
    eyebrow: "Why near-peer",
    title: "People learn with people.",
  },
  evidence: {
    eyebrow: "Research that informs our approach",
    title: "Ideas worth putting into practice.",
    link: "Read the evidence",
  },
  roles: {
    eyebrow: "Who it’s for",
    title: "A shared effort, with a place for everyone.",
  },
  finalCta: {
    eyebrow: "Start with one question",
    title: "Bring fieldwork into the classroom.",
    description:
      "Join the pilot and help shape a practical learning partnership.",
    action: "Join the pilot",
  },
} as const;

export const howItWorksCopy = {
  eyebrow: "How it works",
  title: "Fieldwork, shared through four simple steps.",
  intro:
    "KSS brings agriculture students and rural classrooms together around practical questions from the farms and communities around them.",
  perspectiveEyebrow: "Choose your perspective",
  perspectiveTitle: "One partnership, different roles.",
  cta: "Interested in making local, hands-on learning part of the week?",
  ctaAction: "Join the pilot",
} as const;

export const journeyCopy = {
  tabsLabel: "Explore the process by role",
  tabs: [
    { value: "mentor", label: "Mentor" },
    { value: "school", label: "School" },
    { value: "admin", label: "College admin" },
  ],
  rhythmTitle: "A realistic rhythm",
  rhythmDescription:
    "Plan for about 1–3 hours a week alongside RAWE fieldwork. The exact rhythm is agreed with the school and adapted to the placement.",
} as const;

export const evidencePageCopy = {
  eyebrow: "Research notes",
  title: "Evidence that shapes our questions.",
  intro:
    "These papers inform the ideas behind KSS. They are not evaluations of the KSS pilot or claims about its outcomes.",
  findingLabel: "Finding",
  relevanceLabel: "Why it matters for KSS",
  summaryNote:
    "Summaries are our own reading of the papers; see originals for full detail. The Lone et al. entry is based on the abstract only.",
  abstractLabel: "Abstract-based summary",
} as const;

export const surveyPageCopy = {
  eyebrow: "Listen and learn",
  title: "Help us shape the pilot.",
  intro:
    "This validation survey helps us understand what agriculture students, schools, and colleges need from a practical mentoring partnership. Your answers will help us refine the questions and the pilot design.",
  formTitle: "KSS validation survey",
  formDescription:
    "The form is hosted externally. You can open it in a new tab or complete it below when an embed URL is configured.",
  openSurvey: "Open survey",
  configurationNotice: "Survey link coming soon. Configure",
  configurationSuffix: "to show the form here.",
  resultsTitle: "What we’re learning",
  resultsDescription:
    "When results are ready to share, this space will show a summary of responses. We will not present placeholder numbers as findings.",
  resultsPlaceholder: "Results chart coming soon",
  evidencePrompt: "Want to understand the research behind our approach?",
  evidenceLink: "Read the evidence notes",
} as const;

export const publicFooterCopy = {
  affiliation: "Built for Techno-Social Competition ’26 · i2i, Bhau Institute, COEP",
  contactLabel: "Contact the KSS team",
  contactFallback: "Contact us through the survey",
  contactHref: "/survey",
} as const;

export const howSteps = [
  {
    number: "01",
    title: "Match",
    description:
      "Connect a final-year agriculture student with a nearby rural classroom.",
  },
  {
    number: "02",
    title: "Mentor",
    description:
      "Bring a little practical guidance to a teacher and curious students.",
  },
  {
    number: "03",
    title: "Experiment",
    description:
      "Turn fieldwork into small, observable experiments on farms and at school.",
  },
  {
    number: "04",
    title: "Compound",
    description:
      "Share what worked so each new learning cycle can build on the last.",
  },
] as const;

export const problemGroups = [
  {
    eyebrow: "For agriculture students",
    title: "Fieldwork has room to reach further.",
    points: [
      "Practical learning can feel disconnected from everyday community needs.",
      "Career uncertainty can make it harder to turn confidence into action.",
      "Teaching and explaining are useful skills to practice in the field.",
    ],
  },
  {
    eyebrow: "For rural classrooms",
    title: "Local questions deserve hands-on learning.",
    points: [
      "Agriculture is part of daily life, but not always part of classroom practice.",
      "A nearby mentor can make science feel relevant and approachable.",
      "Small experiments invite children to observe, ask, and learn by doing.",
    ],
  },
] as const;

export const whyNearPeer: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Sprout,
    title: "A self-renewing supply",
    description:
      "Each new cohort brings students with current fieldwork and local knowledge.",
  },
  {
    icon: HandHeart,
    title: "Near-peer, not AI",
    description:
      "Children learn with a real person who can listen, adapt, and explore alongside them.",
  },
  {
    icon: UsersRound,
    title: "Zero recruiting cost",
    description:
      "The model starts with students already completing RAWE fieldwork, instead of creating a separate mentor pipeline.",
  },
];

export const evidenceCards = [
  {
    label: "Learning",
    title: "Experience makes ideas actionable",
    summary:
      "Research points to mindset, confidence, and hands-on experience as important parts of entrepreneurial learning.",
    linkLabel: "See sources",
    href: "/evidence",
  },
  {
    label: "Confidence",
    title: "Self-efficacy matters",
    summary:
      "Feeling capable can shape whether students see a path from an idea to an action.",
    linkLabel: "See sources",
    href: "/evidence",
  },
  {
    label: "Support",
    title: "Context can change the path",
    summary:
      "Uncertainty and access to mentorship both matter when people try to put intentions into practice.",
    linkLabel: "See sources",
    href: "/evidence",
  },
  {
    label: "KSS approach",
    title: "Practice close to home",
    summary:
      "KSS connects student fieldwork to local questions, with room to learn through doing.",
    linkLabel: "See sources",
    href: "/evidence",
  },
] as const;

export const roleCards = [
  {
    role: "Mentors",
    action: "Join as mentor",
    description:
      "Share what you are learning and guide children through real farm-based experiments.",
    href: "/register?role=mentor",
    icon: Sprout,
  },
  {
    role: "Schools",
    action: "Join as school",
    description:
      "Bring practical, locally relevant agriculture learning into your classroom.",
    href: "/register?role=school",
    icon: BookOpenCheck,
  },
  {
    role: "Colleges",
    action: "Join as a college",
    description:
      "Support students in connecting RAWE fieldwork with community learning.",
    href: "/register?role=admin",
    icon: UsersRound,
  },
] as const;

export const evidenceSummaries = [
  {
    authors: "Amaran K., Krishnamoorthy A., Shobana P. (2025)",
    title:
      "Fostering the future: Agripreneurship intentions among Indian agricultural students",
    citation: "Heliyon 11, e42163.",
    finding:
      "The study reports that formal agripreneurship education had limited influence on intention, while attitude, social norms, perceived control, and personality were influential.",
    relevance:
      "KSS emphasizes confidence, encouragement, and practical agency—not coursework alone.",
    abstractBased: false,
  },
  {
    authors: "Rajan Babu M. et al. (2026)",
    title: "Human dynamics of agripreneurial creation",
    citation: "Front. Hum. Dyn. 8:1782307.",
    finding:
      "The authors identify entrepreneurial mindset and self-efficacy as strong predictors and underline the value of experiential learning.",
    relevance:
      "Mentoring and field experiments give students a setting to practice initiative and build confidence.",
    abstractBased: false,
  },
  {
    authors: "Anton S., Mansingh J.P. (2026)",
    title: "From campus to croplands",
    citation: "Front. Sustain. Food Syst. 10:1814235.",
    finding:
      "The study finds that fear of career uncertainty can weaken the relationship between self-efficacy and intention.",
    relevance:
      "Local, supported practice may help students explore meaningful ways to apply what they know.",
    abstractBased: false,
  },
  {
    authors: "Lone A.H., Rashid I., Gulzar F. (2026)",
    title: "Entrepreneurial ecosystems in fragile agrarian contexts",
    citation: "J. Entrepreneurship & Public Policy.",
    finding:
      "The abstract describes incubation and mentorship support as helpful in moving entrepreneurial intention toward action.",
    relevance:
      "KSS explores mentorship as a practical bridge between student intentions and community-facing activity.",
    abstractBased: true,
  },
] as const;

export const roleJourneys = {
  mentor: {
    title: "A mentor’s week",
    intro:
      "Fit short, practical sessions around the fieldwork you already do through RAWE.",
    steps: [
      "Choose a local school and agree on a simple question to explore.",
      "Prepare a small activity using materials and observations from the community.",
      "Meet with the class, observe together, and record what you notice.",
      "Share reflections with the teacher and use them to shape the next visit.",
    ],
  },
  school: {
    title: "A school’s week",
    intro:
      "Bring local agriculture questions into lessons, with a student mentor as a partner.",
    steps: [
      "Share the class’s interests and practical needs with a nearby mentor.",
      "Choose a topic that connects to the school, village, or season.",
      "Make space for children to observe, ask questions, and try an experiment.",
      "Reflect together on what students noticed and what they want to explore next.",
    ],
  },
  admin: {
    title: "A college admin’s week",
    intro:
      "Help students connect placements and RAWE learning with schools in their communities.",
    steps: [
      "Identify interested students and the field placements they already have.",
      "Coordinate introductions with participating schools and mentors.",
      "Support a manageable rhythm alongside existing fieldwork.",
      "Review learning notes and help good practices travel to the next cohort.",
    ],
  },
} as const;

export type JourneyRole = keyof typeof roleJourneys;
