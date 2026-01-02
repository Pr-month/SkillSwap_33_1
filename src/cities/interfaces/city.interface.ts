export interface CityCoords {
  lat: string;
  lon: string;
}

export interface City {
  coords: CityCoords;
  district: string;
  name: string;
  population: number;
  subject: string;
}
