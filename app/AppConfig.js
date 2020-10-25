export let darkMode = false;
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
export const PRIMARY_COLOR = Colors.Blue.Normal;
export const PRIMARY_DARK_COLOR = Colors.Blue.Dark;
export const SECONDARY_COLOR = darkMode ? BLACK : WHITE;
export const SECONDARY_NEGATIVE_COLOR = darkMode ? WHITE : BLACK;
export const SECONDARY_HALF_COLOR = '#808080';
export const SECONDARY_ONE_FOURTH_COLOR = darkMode ? '#bfbfbf' : '#383838';
export const SECONDARY_THREE_FOURTH_COLOR = darkMode ? '#383838' : '#bfbfbf';
export const DIALOG_BACKGROUND_COLOR = darkMode
  ? 'rgba(0, 0, 0, 0.45)'
  : 'rgba(0, 0, 0, 0.7)';

