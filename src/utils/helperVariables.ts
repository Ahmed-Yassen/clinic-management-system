const sessionDuration = 20; //- 20 Minutes Per Session
const openingHour = 17; //- Clinic Opens at 5PM
const closingHour = 23; //- Clinic Closes at 11PM
const sessionsPerHour = 60 / sessionDuration;
const workingHours = closingHour - openingHour;
const maxSessionsPerDay = workingHours * sessionsPerHour;

export {
  openingHour,
  closingHour,
  sessionDuration,
  maxSessionsPerDay,
  sessionsPerHour,
};
