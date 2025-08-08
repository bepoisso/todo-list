import fastify from "fastify";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import './db/db';

dotenv.config();

import { REPL_MODE_SLOPPY } from "repl";
import { FastifyInstance } from "fastify";
import { signToken } from './auth';
import { verifyAuth } from './auth';


const app = fastify();
const db = require('./db/db').default;

// Route GET /ping
app.get('/ping', async (request, reply) => {
	return {message: 'pong'};
});

// start the server
app.listen({port: 3000}, (err, adress) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${adress}`);
});

// Route POST /register
app.post('/register', async (request, reply) => {
	const {username, email, password} = request.body as {username: string; email: string; password: string; };

	// Validate input
	if (!username || !email || !password) {
		return reply.status(400).send({error : 'Missing required fields'});
	}

	// Hash the password
	const passwordHash = await bcrypt.hash(password, 10);

	// insert user into the database
	try {
		db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, passwordHash);
		return reply.status(201).send({message: 'User registered successfully'});
	} catch (err) {
		return reply.status(400).send({message: 'User already exists'});
	}
});

// Route POST /login
app.post('/login', async (request, reply) => {
	const {email, password} = request.body as {email: string; password: string;};

	// Validate input
	if (!email || !password) {
		return reply.status(400).send({error: 'Missing required fields'});
	}

	// Check if user exists
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (!user) {
		return reply.status(401).send({error: 'Invalid credentials'});
	}

	// Check if password the same
	const verif = await bcrypt.compare(password, user.password_hash);
	if (!verif)  {
		return reply.status(401).send({error: 'Invalid credentials'});
	}

	// Create JWT token with user id
	const jwtsecret = process.env.JWT_SECRET;
	if (!jwtsecret) {
		throw new Error('JWT_SECRET environment variable is not set');
	}
	const token = signToken({ id: user.id, username: user.username });
	return reply.send({token});
});

// Get tasks
app.get('/task', { preHandler: verifyAuth }, async (request, reply) => {
	// Middleware verif
	const user = (request as any).user;
	
	try {
	// Request SQL to get tasks
		const tasks = db.prepare('\
			SELECT id, title, description, is_done\
			FROM tasks\
			WHERE user_id = ?').all(user.id);

			return reply.send({user: user.username, tasks});
		} catch (err) {
			return reply.status(500).send({error: 'Server error'});
		}
});

// Add task into DB
app.post('/task', {preHandler: verifyAuth}, async (request, reply) => {
	const user = (request as any).user;

	try {
		const {title, description} = request.body as  {
			title: string;
			description: string;
		};

		if (!title) {
			return reply.status(400).send({error: 'Title is requierd'});
		}

		// SQL command to add task
		db.prepare('\
			INSERT INTO tasks (title, description, user_id)\
			VALUES (?, ?, ?)\
			').run(title, description || '', user.id);

			return reply.status(201).send({message: 'Task successfully add'});
	} catch (err) {
		console.error(err);
		return reply.status(500).send({error: 'Server error'});
	}
});

// Update a task
app.put('/task', {preHandler: verifyAuth}, async (request, reply) => {
	const user = (request as any).user;

	try {
		const id = (request.query as any).id as string;
		if (!id) {
			return reply.status(400).send({error: 'Missing task ID'});
		}
		
		const {title, description, is_done} = request.body as {
			title: string;
			description: string;
			is_done: boolean;
		};

		// Check if the task exists and belongs to the user
		const task = db.prepare('\
			SELECT * FROM tasks WHERE id = ? AND user_id = ?\
			').get(id, user.id);

		if (!task) {
			return reply.status(404).send({error: 'Task not found'});
		}
		// Update the task
		const updateTitle = title !== undefined ? title : null;
		const updateDescription = description !== undefined ? description : null;
		const updateIsDone =
			typeof is_done === 'boolean' ? (is_done ? 1 : 0) :
			is_done !== undefined ? is_done : null;

		db.prepare('\
			UPDATE tasks\
			SET title = COALESCE(?, title),\
				description = COALESCE(?, description),\
				is_done = COALESCE(?, is_done)\
			WHERE id = ? AND user_id = ?\
		').run(updateTitle, updateDescription, updateIsDone, id, user.id);

		return reply.send({message: 'Task update successfully'});
	} catch (err) {
		console.error(err);
		return reply.status(500).send({error: 'Server error'});
	}
});

app.delete('/task', {preHandler: verifyAuth}, async (request, reply) => {
	const user = (request as any).user;

	try {
		const id = (request.query as any).id as string;
		if (!id) {
			return reply.status(400).send({error: 'Missing task ID'});
		}

		// Check that the task exists and belongs to the user
		const task = db.prepare('\
			SELECT * FROM tasks WHERE id = ? AND user_id = ?\
			').get(id, user.id);
		
		if (!task) {
			return reply.status(404).send({error: 'Task not found'})
		}

		// Delete task from db
		db.prepare('\
			DELETE FROM tasks WHERE id = ? AND user_id = ?\
			').run(id, user.id);

		return reply.send({message: 'Task successfully deleted'});
	} catch (err) {
		console.error(err);
		return reply.status(500).send({error: 'Server error'});
	}
});

export default app;

