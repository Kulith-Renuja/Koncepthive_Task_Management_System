// backend/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();

const generateTokens = (userId: number) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = userResult.rows[0];

        // 2. Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // 4. Set Refresh Token in HTTP-Only Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/refresh', (req: Request, res: Response): any => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        // Issue a new access token
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
});

export default router;