export interface Project {
    name: string;
    description: string;
    url: string;
    tags: string[];
}

export interface Map {
    name: string;
    client: string;
    event?: string;
    size: string;
    hours: number;
    terrain: string;
    location: {
        lat: number;
        lon: number;
    };
}