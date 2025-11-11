import jwt from "jsonwebtoken";

export type JwtPayload = Record<string, unknown> & {
  sub: string;
  aud: string;
  exp?: number;
  iat?: number;
};

export const signToken = (payload: JwtPayload, secret: string, expiresIn = "15m") => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
