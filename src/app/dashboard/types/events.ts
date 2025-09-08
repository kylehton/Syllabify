
export interface EventItem {
    id: string;
    name: string;
    date: string; // RFC3339 date string
    type: "exam" | "homework" | "project";
}