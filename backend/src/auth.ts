import jwt from 'jsonwebtoken';
import fastify from "fastify";

import { FastifyRequest, FastifyReply } from 'fastify';

export function signToken(payload:object):string {
	const jwtsecret = process.env.JWT_SECRET;
	if (!jwtsecret) {
		throw new Error('JWT_SECRET environment variable is not set');
	}
	return jwt.sign(payload, jwtsecret, {expiresIn: '1h'});
};

export function verifyAuth(request: FastifyRequest, reply: FastifyReply, done: Function) {
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return reply.status(401).send({error: 'Missing or invalid token'})
	}

	const token = authHeader.split(' ')[1];

	try {
		const jwtsecret = process.env.JWT_SECRET;
		if (!jwtsecret) {
			throw new Error('JWT_SECRET environment variable is not set');
		}
		const decoded = jwt.verify(token, jwtsecret) as { id: number; username: string };
		
		// Attacher l'utilisateur à la requête
		(request as any).user = decoded;
		
		done();
	} catch (err) {
		return reply.status(401).send({ error: 'Invalid or expired token' });
	}
};
