export const qk = {
  me: ["me"] as const,
  mentors: {
    all: ["mentors"] as const,
    list: (filters: object = {}) => ["mentors", "list", filters] as const,
    detail: (id: string) => ["mentors", id] as const,
  },
  schools: {
    list: (filters: object = {}) => ["schools", filters] as const,
    detail: (id: string) => ["schools", id] as const,
  },
  matches: {
    mine: ["matches", "mine"] as const,
    list: (filters: object = {}) => ["matches", filters] as const,
  },
  experiments: {
    list: (filters: object = {}) => ["experiments", filters] as const,
    detail: (id: string) => ["experiments", id] as const,
    observations: (id: string) => ["experiments", id, "observations"] as const,
  },
  placements: {
    list: (filters: object = {}) => ["placements", filters] as const,
    detail: (id: string) => ["placements", id] as const,
  },
  insights: (scope: string, metric: string) =>
    ["insights", scope, metric] as const,
  adminStudents: (filters: object = {}) =>
    ["admin", "students", filters] as const,
};
