import type { Request, Response } from 'express';

import { UserRepository } from '../repositories/UserRepository';
import { ErrorResponse, SuccessResponse } from '../utils/ApiResponse';

export class UserController {
  /**
   * Fetches all users in the database with pagination
   * @swagger
   * /api/v1/users:
   *   get:
   *     tags:
   *       - Users
   *     security: [{"bearerAuth": []}]
   *     summary: Fetches all users with pagination
   *     description: Returns a list of all users in the database with pagination
   *     parameters:
   *       - in: query
   *         name: limit
   *         description: The number of items to return
   *         schema:
   *           type: integer
   *         example: 10
   *       - in: query
   *         name: page
   *         description: The page number
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: A list of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *                 count:
   *                   type: number
   *                 limit:
   *                   type: number
   *                 offset:
   *                   type: number
   *       500:
   *         description: An error occurred while fetching users
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async getUsers(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * limit;

    try {
      const [users, count] = await Promise.all([
        UserRepository.findAll(limit, offset),
        UserRepository.count(),
      ]);

      SuccessResponse.send(
        res,
        {
          users,
          totalCount: count,
          totalPages: Math.ceil(count / limit),
          currentPage: offset / limit + 1,
        },
        'Users fetched successfully'
      );
    } catch (error) {
      ErrorResponse.send(
        res,
        'Failed to fetch users',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
