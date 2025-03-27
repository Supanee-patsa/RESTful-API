import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
/**
 * Swagger configuration
 */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple Express API for managing users',
    },
  },
  apis: ['server.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
];

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
app.get('/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 */

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required!' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  res.json({ message: 'User added successfully!', user: newUser });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json({ message: 'User updated successfully!', user });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((u) => u.id !== userId);
  res.json({ message: 'User deleted successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
