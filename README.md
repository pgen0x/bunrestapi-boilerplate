# REST-API Boilerplate

A modern, scalable, and production-ready boilerplate for building APIs with **Bun**, **Prisma**, **Log4js**, and **Swagger**. This project includes authentication, role-based access control, logging, and API documentation.

---

## Features

- **Bun**: Fast JavaScript runtime.
- **Prisma**: Type-safe database ORM.
- **Log4js**: Structured logging with file rotation.
- **Swagger**: Auto-generated API documentation.
- **Authentication**: JWT-based authentication.
- **Role-Based Access Control**: Middleware for restricting access by user roles.
- **Error Handling**: Centralized error handling with standardized responses.
- **Validation**: Request validation using Zod.
- **Environment Variables**: Configuration via `.env` file.

---

## Getting Started

### Prerequisites

- **Bun**: Install Bun from [bun.sh](https://bun.sh/).
- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
- **Prisma**: Install Prisma CLI globally:

```bash
bun add -g prisma
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bun-boilerplate.git
cd bun-boilerplate
```

2. Install dependencies:

```bash
bun install
```

3. Set up the database:

- Update the DATABASE_URL in .env with your database connection string.
- Run migrations:

```bash
npx prisma migrate dev --name init
```

4. Start the server:

```bash
bun start
```

## Project Structure

```plaintext
bun-boilerplate/
├── src/
│ ├── config/ # Configuration
│ ├── constants/ # Constants handlers
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Middleware functions
│ ├── repositories/ # Database access layer
│ ├── routes/ # API routes
│ ├── utils/ # Utility functions
│ ├── app.ts # Express app setup
│ └── server.ts # Server entry point
│ └── swagger.ts # Swagger documentation config
├── prisma/ # Prisma schema and migrations
├── logs/ # Log files
├── .env # Environment variables
├── .eslintrc.json # ESLint configuration
├── .prettierrc # Prettier configuration
├── bun.lock # Bun lockfile
├── package.json # Project dependencies
├── README.md # Project documentation
└── tsconfig.json # TypeScript configuration
```

## API Documentation

The API is documented using Swagger. After starting the server, visit:

```plaintext
http://localhost:8888/docs
```

## Environment Variables

Create a .env file in the root directory with the following variables:

```plaintext
PORT=8888
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

## Logging

Logs are stored in the logs/ directory and rotated daily. Log levels:

- Development: Logs to console and file.
- Production: Logs to file only.

### Example Log Output

```plaintext
[2023-10-30T12:34:56.789] [INFO] app.ts - 🚀 Server is running on http://localhost:8888
```

## Error Handling

Errors are handled centrally and return standardized responses:

### Example Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": [{ "field": "firstName", "message": "First name is required" }],
  "timestamp": "2023-10-30T12:34:56.789Z"
}
```

## Code Formatting and Linting

- Prettier: Ensures consistent code formatting.
- ESLint: Enforces coding
  standards and organizes imports.

### Commands

- Format code:

```bash
bun run format
```

- Lint code:

```bash
bun run lint
```

## Contributing

1. Fork the repository.

2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push to the branch:

```bash
git push origin feature/your-feature
```

5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Bun: For the fast JavaScript runtime.
- Prisma: For the type-safe database ORM.
- Log4js: For structured logging.
- Swagger: For API documentation.
