import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { ErrorResponse, SuccessResponse } from '../utils/ApiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export class AuthController {
  /**
   * Registers a new user.
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Registers a new user
   *     description: Registers a new user with the given details
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - email
   *               - password
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               role:
   *                 type: string
   *                 default: USER
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 token:
   *                   type: string
   *       400:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return ErrorResponse.send(res, 'User already exists', 400);
      }

      // Hash the password
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: 'bcrypt',
        cost: SALT_ROUNDS,
      });

      // Create the user
      const user = await UserRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'USER', // Default role is USER
      });

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
      });

      // Return the user and token except the password
      const { password: userPassword, ...userResponse } = user;
      SuccessResponse.send(
        res,
        { ...userResponse, token },
        'User registered successfully',
        201
      );
    } catch (error) {
      ErrorResponse.send(
        res,
        'Failed to register user',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login to the application
   *     description: Returns a JWT token that can be used to authenticate subsequent requests
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: secret
   *     responses:
   *       200:
   *         description: A JWT token that can be used to authenticate subsequent requests
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   format: bearer
   *                   example: Bearer <token>
   *       401:
   *         description: Invalid email or password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 statusCode:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: Invalid email or password
   *                 error:
   *                   type: string
   *                   example: Invalid email or password
   *                 timestamp:
   *                   type: string
   *       500:
   *         description: An error occurred while logging in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 statusCode:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Unknown error
   *                 error:
   *                   type: string
   *                   example: An error occurred while logging in
   *                 timestamp:
   *                   type: string
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return ErrorResponse.send(res, 'Invalid email or password', 401);
      }

      // Compare passwords
      const isPasswordValid = await Bun.password.verify(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return ErrorResponse.send(res, 'Invalid email or password', 401);
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
      });

      // Return the token
      SuccessResponse.send(res, { token }, 'Login successful');
    } catch (error) {
      ErrorResponse.send(
        res,
        'Failed to login',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
