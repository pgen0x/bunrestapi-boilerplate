import prisma from '../../prisma/client';
import { DEFAULT_SORT_ORDER } from '../constants';

export class UserRepository {
  static async findAll(limit: number = 10, offset: number = 0) {
    return prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: DEFAULT_SORT_ORDER,
      },
      take: limit,
      skip: offset,
    });
  }

  static async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async count() {
    return prisma.user.count();
  }
}
