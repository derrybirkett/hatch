import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(data: { email: string; name: string; password: string }): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date(),
    };
    
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }
}
