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

export function dateShortPL(date, {showYear = false, showWeekDay = true} = {}) {
  return (
    (showWeekDay ? daysOfWeekShortPL[date.getDay()] + ', ' : '') +
    date.getDate() +
    ' ' +
    monthsShortPL[date.getMonth()] +
    (showYear ? ' ' + date.getFullYear() : '')
  );
}

export function yearMonthPL(date) {
  return monthsPL[date.getMonth()] + ' ' + date.getFullYear();
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

export const daysOfWeekShortPL = [
  'niedz.',
  'pon.',
  'wt.',
  'śr.',
  'czw.',
  'pt.',
  'sob.',
];

export const daysOfWeekFirstLetterPL = ['p', 'w', 'ś', 'c', 'p', 's', 'n'];

export const monthsPL = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
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

export const monthsShortPL = [
  'sty',
  'lut',
  'mar',
  'kwi',
  'maj',
  'cze',
  'lip',
  'sie',
  'wrz',
  'paź',
  'lis',
  'gru',
];
