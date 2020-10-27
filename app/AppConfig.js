export let darkMode = false;
export function SetDarkMode(isDark) {
  darkMode = isDark;
}
export const Colors = {
  Blue: {
    Normal: '#0788D9',
    Dark: '#04588c',
  },
  Lime: {
    Normal: '#799905',
    Dark: '#6e8c00',
  },
  Green: {
    Normal: '#798C35',
    Dark: '#485922',
  },
  Grey: {
    Normal: '#616161',
    Dark: '#3d3d3d',
  },
  Purple: {
    Normal: '#55378c',
    Dark: '#362359',
  },
  Pink: {
    Normal: '#8c0483',
    Dark: '#4a0245',
  },
  Red: {
    Normal: '#8b0404',
    Dark: '#4a0202',
  },
  Orange: {
    Normal: '#ad4b05',
    Dark: '#592703',
  },
};
export const BLACK = '#151515';
export const WHITE = '#FAFAFA';
export const LIGHT_GREY = '#efefef';
export let primaryColor = Colors.Blue.Normal;
export function SetPrimaryColor(color) {
  primaryColor = color;
}
export let primaryDarkColor = Colors.Blue.Dark;
export function SetPrimaryDarkColor(color) {
  primaryDarkColor = color;
}
export function UpdateColors() {
  secondaryColor = darkMode ? BLACK : WHITE;
  secondaryNegativeColor = darkMode ? WHITE : BLACK;
  secondaryOneFourthColor = darkMode ? '#bfbfbf' : '#383838';
  secondaryThreeFourthColor = darkMode ? '#383838' : '#bfbfbf';
  dialogBackgroundColor = darkMode
    ? 'rgba(20, 20, 20, 0.75)'
    : 'rgba(0, 0, 0, 0.5)';
}
export let secondaryColor = darkMode ? BLACK : WHITE;
export let secondaryNegativeColor = darkMode ? WHITE : BLACK;
export const SECONDARY_HALF_COLOR = '#808080';
export let secondaryOneFourthColor = darkMode ? '#bfbfbf' : '#383838';
export let secondaryThreeFourthColor = darkMode ? '#383838' : '#bfbfbf';
export let dialogBackgroundColor = darkMode
  ? 'rgba(20, 20, 20, 0.75)'
  : 'rgba(0, 0, 0, 0.5)';

