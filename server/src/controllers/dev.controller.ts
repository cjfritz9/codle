import { Request, Response } from 'express';

export const httpDevTesting = async (req: Request, res: Response) => {
  const { timezoneOffset } = req.query;
  const currentDate = new Date();
  // const offset = currentDate.getTimezoneOffset();
  console.log(timezoneOffset)
  currentDate.setHours(currentDate.getHours() - +timezoneOffset! / 60)

  console.log(currentDate, currentDate.getMinutes(), currentDate.getTimezoneOffset());

  res.status(200).send({ success: 'Completed' });
};
