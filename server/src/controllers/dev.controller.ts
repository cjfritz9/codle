import { Request, Response } from 'express';

export const httpDevTesting = async (req: Request, res: Response) => {
  const { timezoneOffset } = req.query;
  const currentDate = new Date();

  currentDate.setTime(currentDate.getTime() - +timezoneOffset! / 60);

  const anotherDate = new Date(2023, 7, 28);
  const fullYears = [anotherDate.getFullYear(), currentDate.getFullYear()];
  const months = [anotherDate.getMonth(), currentDate.getMonth()];
  const days = [anotherDate.getDate(), currentDate.getDate()];

  const isSame =
    anotherDate.getFullYear() === currentDate.getFullYear() &&
    anotherDate.getMonth() === currentDate.getMonth() &&
    anotherDate.getDate() === currentDate.getDate();

  console.log({
    CURR_DATE: currentDate.toUTCString(),
    ANOTHER_DATE: anotherDate.toUTCString(),
    YEARS: fullYears,
    MONTHS: months,
    DAYS: days,
    isSame
  });

  res.status(200).send({ success: 'Completed' });
};
