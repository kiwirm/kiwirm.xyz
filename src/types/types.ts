export interface TableRow {
  key: string;
  relations: Record<string, string | null>;
  data: Record<string, any>;
  url?: string;
  location?: {lat: number; lon: number};
}
export interface Project {
  name: string,
  relationName: string,
  rows: TableRow[];
}
export interface Map {
  name: string;
  relationName: string;
  rows: TableRow[];
}

export type TableData = Project | Map;
