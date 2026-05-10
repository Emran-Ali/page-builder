import jwt from 'jsonwebtoken';

export type User = {
    id: string;
    email: string;
    name: string;
}

export function generateAccessToken(user: User) {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d', algorithm: 'RS256' });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['RS256'] });
}