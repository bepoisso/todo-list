import fastify from "fastify";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


import './db/db';
import { signToken } from './auth';
import { REPL_MODE_SLOPPY } from "repl";
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

export default app;

