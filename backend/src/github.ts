import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './db/db';
import { signToken } from './auth';
import { User } from './types/db';

dotenv.config();

export default async function githubRoutes(app: FastifyInstance) {
    app.get('/auth/github', async (request, reply) => {
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
        return reply.redirect(redirectUrl);
    });

    app.get('/auth/github/callback', async (request, reply) => {
        const code = (request.query as any).code;

        if (!code) {
            return reply.status(400).send({error: 'Missing code'})
        }

        // exchange the code for a token
        const tokenResponse = await fetch(`https://github.com/login/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GITHUB_REDIRECT_URI
            })
        });

        const tokenData = await tokenResponse.json() as { access_token: string };
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            return reply.status(400).send({ error: 'Unable to retrieve token' });
        }

        // Get user info
        const userResponse = await fetch(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const githubUser = await userResponse.json() as { id: number, login: string };

        // Register or signin user
        let user = db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubUser.id) as User | undefined;
        if (!user) {
            db.prepare('INSERT INTO users (github_id, username) VALUES (?, ?)').run(githubUser.id, githubUser.login);
            user = db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubUser.id) as User;
        }

        // Create a JWT token for user
        const jwtsecret = process.env.JWT_SECRET;
        if (!jwtsecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const token = signToken({ id: user.id, username: user.username });
        return reply.send({token});
    });
}
