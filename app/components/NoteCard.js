import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {SecondaryNegativeColor, SecondaryHalfColor} from '../AppConfig';

const NoteCard = (props) => {
  const [backgroundColor, setBackgroundColor] = useState(
    props.note.color || props.backgroundColor || SecondaryHalfColor,
  );
  const [borderColor, setBorderColor] = useState(
    props.borderColor || backgroundColor || SecondaryHalfColor,
  );
  const [titleColor, setTitleColor] = useState(
    props.titleColor || SecondaryNegativeColor,
  );
  const [textColor, setTextColor] = useState(
    props.textColor || SecondaryNegativeColor,
  );

  return (
    <TouchableOpacity
      onPress={props.OnPressCard}
      onLongPress={props.OnLongPressCard}
      style={[
        styles.mainContainer,
        {
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={styles.innerContainer}>
        <Text style={[styles.title, {color: titleColor}]}>
          {props.note.title}
        </Text>
      </View>
      <View>
        <Text style={[styles.text, {color: textColor}]}>
          {props.note.text
            ? props.note.text.length > 140
              ? props.note.text.substring(0, 140) + '...'
              : props.note.text
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 17,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 3,
    borderRadius: 7,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

export default NoteCard;
