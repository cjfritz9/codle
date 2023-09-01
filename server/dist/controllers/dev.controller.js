export const httpDevTesting = async (_req, res) => {
    // const { timezoneOffset } = req.query;
    // const currentDate = new Date();
    // currentDate.setTime(currentDate.getTime() - +timezoneOffset! / 60);
    // const anotherDate = new Date(2023, 7, 28);
    // const fullYears = [anotherDate.getFullYear(), currentDate.getFullYear()];
    // const months = [anotherDate.getMonth(), currentDate.getMonth()];
    // const days = [anotherDate.getDate(), currentDate.getDate()];
    // const isSame =
    //   anotherDate.getFullYear() === currentDate.getFullYear() &&
    //   anotherDate.getMonth() === currentDate.getMonth() &&
    //   anotherDate.getDate() === currentDate.getDate();
    // console.log({
    //   CURR_DATE: currentDate.toUTCString(),
    //   ANOTHER_DATE: anotherDate.toUTCString(),
    //   YEARS: fullYears,
    //   MONTHS: months,
    //   DAYS: days,
    //   isSame
    // });
    // const resetDate = new Date();
    // resetDate.setHours(resetDate.getHours() - 11);
    // resetDate.setMinutes(resetDate.getMinutes() - 59);
    // const compDate = new Date();
    // compDate.setHours(compDate.getHours() - 11);
    // compDate.setMinutes(compDate.getMinutes() - 60);
    // console.log(resetDate.toUTCString());
    // console.log(compDate.toUTCString());
    res.status(200).send({ success: 'Completed' });
};
