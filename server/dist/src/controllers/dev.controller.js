var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import serviceAccount from '../secrets/gcp-service-account.json' assert { type: 'json' };
export const httpDevTesting = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    console.log(serviceAccount);
    res.status(200).send({ success: 'Completed' });
});
