import moment from "moment";

const throwCustomError = (errorMessage: string, errorStatus: number) => {
  const error: any = new Error(errorMessage);
  error.status = errorStatus;
  throw error;
};

const isOffDay = (date: Date): Boolean => {
  return date.toDateString().match(/^(fri|sat)/i) !== null;
};

const toGMT2 = (date: Date): Date => {
  return moment(new Date(date)).add(2, "hours").toDate();
};

export { throwCustomError, toGMT2, isOffDay };
