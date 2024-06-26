import { Response } from "express";

export const errorHandler = (res: Response, error: Error) => {
  if (error instanceof Error) {
    res.status(500).json(error?.message);
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
