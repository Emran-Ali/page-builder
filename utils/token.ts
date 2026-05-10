import jwt from "jsonwebtoken";

export type User = {
  id: string;
  email: string;
  name: string;
};

export function generateAccessToken(user: User) {
  const config = useRuntimeConfig();
  return jwt.sign({ user }, config.jwtSecret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string) {
  const config = useRuntimeConfig();
  return jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
}
