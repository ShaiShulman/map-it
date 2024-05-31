import { Request, Response, NextFunction } from "express";

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    req.ip + " >> " + req.protocol + "://" + req.get("host") + req.originalUrl
  );
  console.log("\t", req.query);
  next();
};
