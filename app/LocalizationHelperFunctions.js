export function time(date) {
  return (
    (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) +
    ':' +
    (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes())
  );
}

export function datePL(date, {showYear = true, showWeekDay = true} = {}) {
  return (
    (showWeekDay ? daysOfWeekPL[date.getDay()] + ', ' : '') +
    date.getDate() +
    ' ' +
    monthsAltPL[date.getMonth()] +
    (showYear ? ' ' + date.getFullYear() : '')
  );
}

export const daysOfWeekPL = [
  'Niedziela',
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
];

export const monthsAltPL = [
  'Stycznia',
  'Lutego',
  'Marzca',
  'Kwietnia',
  'Maja',
  'Czerwca',
  'Lipca',
  'Sierpnia',
  'Września',
  'Października',
  'Listopada',
  'Grudnia',
];
