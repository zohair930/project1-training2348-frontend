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

export interface User {
  id?: number,
  username: string,
  password: string,
  userType?: string,
  account?: Account
}

export enum UserType {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER"
}

export type Users = User[];


export interface Ticket{
  id?: number,
  description: string,
  balance: number
}

export enum TicketStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED"
}

export type Tickets = Ticket[];

export interface Account {
  id?: number,
  name: string,
  password: string
}

export interface Person {
  id?: number,
  status: string,
  balance: number,
  user: User
}


export type AuthContextValue = {
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null> (null);
