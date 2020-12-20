import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  darkMode,
  secondaryNegativeColor,
  primaryColor,
  secondaryColor,
  SECONDARY_HALF_COLOR,
  secondaryThreeFourthColor,
  dialogBackgroundColor,
} from '../../AppConfig';
import * as ColorApi from '../../services/ColorApi';
import ColorSelector from '../ColorSelector';

const AddCategoryDialog = (props) => {
  const [inputText, setInputText] = useState('');
  const [inputColor, setInputColor] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [colors, setColors] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    props.visible &&
      setTimeout(() => {
        inputRef.current.focus();
      }, 10);
  }, [props.visible]);

  useEffect(() => {
    ColorApi.getColors()
      .then((newColors) => {
        setColors(newColors);
        newColors && newColors.length > 0 && setInputColor(newColors[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const ChangeInputText = (newText) => {
    if (props.ValidateTextInput(newText) || !newText) {
      setErrorValue(true);
    } else {
      setErrorValue(false);
    }
    setInputText(newText);
  };

  const OnEndTyping = () => {
    if (!inputText || inputText.length === 0) {
      setErrorValue(true);
    }
  };

  const ResetDialog = () => {
    setInputText('');
    setInputColor(colors && colors.length > 0 && colors[0]);
    setErrorValue(false);
  };

  return props.visible ? (
    <View style={styles.backgroundContainer}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogContent}>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.inputView}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                errorValue
                  ? styles.errorColor
                  : {
                      color: secondaryNegativeColor,
                    },
              ]}
              onChangeText={(text) => ChangeInputText(text)}
              onEndEditing={() => OnEndTyping()}
              value={inputText}
              placeholder={props.placeholder}
              placeholderTextColor={
                props.placeholderTextColor || SECONDARY_HALF_COLOR
              }
              underlineColorAndroid={errorValue ? 'red' : primaryColor}
              selectionColor={errorValue ? 'red' : secondaryNegativeColor}
            />
            <Text style={styles.errorText}>{errorValue && 'test'}</Text>
          </View>
          <ColorSelector
            numberOfColumns={7}
            selectedColor={inputColor}
            OnSelectColor={setInputColor}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('press', errorValue, inputText);
                if (!errorValue && inputText) {
                  props.OnPressConfirm(
                    {text: inputText, color: inputColor},
                    errorValue,
                  );
                  ResetDialog();
                }
              }}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>
                {props.confirmText || 'Potwierdź'}
              </Text>
            </TouchableOpacity>
            {!props.onlyConfirmButtonVisible && (
              <TouchableOpacity
                onPress={() => {
                  props.OnPressCancel();
                  ResetDialog();
                }}
                style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>
                  {props.rejectText || 'Anuluj'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: dialogBackgroundColor,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  dialogContainer: {
    flexDirection: 'row',
    marginHorizontal: 40,
  },
  dialogContent: {
    backgroundColor: darkMode ? secondaryThreeFourthColor : secondaryColor,
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 6,
  },
  title: {
    color: secondaryNegativeColor,
    fontSize: 19,
    fontWeight: '700',
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
  },
  inputView: {
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginHorizontal: 5,
  },
  errorColor: {
    color: 'red',
  },
  colorButton: {
    flex: 1,
  },
  selectedColorButton: {
    marginHorizontal: 2,
    marginVertical: 2,
    padding: 20,
  },
  normalColorButton: {
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 14,
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
  },
  confirmButton: {
    paddingTop: 10,
    paddingLeft: 15,
    marginVertical: 10,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: darkMode ? primaryColor : primaryColor,
  },
  rejectButton: {
    paddingTop: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  rejectButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: darkMode ? primaryColor : primaryColor,
  },
});

export default AddCategoryDialog;
