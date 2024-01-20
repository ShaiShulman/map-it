import { Request, Response, NextFunction } from "express";

export const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (process.env.AUTHORIZATION !== "true") {
    next();
    return;
  }

  if (!authHeader) {
    res.status(401).send("Unauthorized: No Authorization header was found");
    return;
  }

  const authParts = authHeader.split(" ");

  if (
    authParts.length !== 2 ||
    authParts[0] !== "Bearer" ||
    authParts[1] !== process.env.GPT_SERVICE_AUTH_KEY
  ) {
    res.status(401).send("Unauthorized: Invalid Authorization header");
    return;
  }

  next();
};
