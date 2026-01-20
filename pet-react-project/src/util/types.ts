import {createContext } from 'react';

export interface Pet {
  id?: number,
  name: string,
  species: string,
  food: string
}

export type Pets = Pet[];

export interface Person {
  id?: number,
  name: string,
  password: string
}

export type AuthContextValue = {
  user: Person | null;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null> (null);
