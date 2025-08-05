import fastify from "fastify";
import bcrypt from 'bcrypt';


import './db/db';
import { REPL_MODE_SLOPPY } from "repl";


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
		await db.run(
			'INSERT INTO users (username, email, passwordHash) VALUES (?, ?, ?)',
			[username, email, passwordHash]
		);
		return reply.status(201).send({message: 'User registered successfully'});
	} catch (err) {
		return reply.status(400).send({message: 'User already exists'});
	}
});

// Route POST /login

export default app;

