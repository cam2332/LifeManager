import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {secondaryNegativeColor, SECONDARY_HALF_COLOR} from '../AppConfig';

const CustomTextInput = forwardRef((props, ref) => {
  const [error, setError] = useState(props.error);
  const [errorText, setErrorText] = useState(props.errorText);

  const onChangeText = (newText) => {
    if (
      props.ValidateTextInput?.(newText) ||
      !newText ||
      newText.length === 0
    ) {
      setError(true);
      setErrorText('');
    } else {
      setError(false);
      setErrorText('');
    }
    props.onChangeText(newText);
  };

  const onEndEditing = () => {
    if (!props.inputText || props.inputText.length === 0) {
      setError(true);
      setErrorText('');
    }
    props.onEndEditing?.();
  };

  useImperativeHandle(ref, () => ({
    setErrorValue(newError, newErrorMessage) {
      setError(newError);
      setErrorText(newErrorMessage);
    },
    hasError() {
      return error;
    },
  }));

  return (
    <View style={props.viewStyle}>
      <TextInput
        ref={props.inputRef}
        style={[
          styles.input,
          props.inputStyle,
          error
            ? styles.errorColor
            : {
                color: secondaryNegativeColor,
              },
        ]}
        color={props.color}
        onChangeText={(text) => onChangeText(text)}
        onEndEditing={() => onEndEditing()}
        value={props.inputText}
        placeholder={props.placeholder}
        placeholderTextColor={
          props.placeholderTextColor || SECONDARY_HALF_COLOR
        }
        underlineColorAndroid={error ? 'red' : props.underlineColorAndroid}
        selectionColor={error ? 'red' : props.selectionColor}
        onKeyPress={(event) => props.onKeyPress(event)}
        secureTextEntry={props.secureTextEntry}
      />
      <Text style={styles.errorText}>{error && errorText}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
  inputView: {},
  errorText: {
    color: 'red',
    marginHorizontal: 5,
  },
  errorColor: {
    color: 'red',
  },
});

export default CustomTextInput;
