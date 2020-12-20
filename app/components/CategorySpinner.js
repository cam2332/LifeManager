import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {
  darkMode,
  secondaryColor,
  secondaryThreeFourthColor,
} from '../AppConfig';
import Icon from 'react-native-vector-icons/Ionicons';

const CategorySpinner = (props) => {
  const selectedOption = (item) => (
    <View style={[styles.optionContainer, {backgroundColor: item.color}]}>
      <Icon
        style={!item.icon && {width: 0}}
        name={item.icon || 'add-sharp'}
        color={item.icon ? secondaryColor : item.color}
        size={24}
      />
      <Text style={[styles.optionText, {color: secondaryColor}]}>
        {item.text}
      </Text>
    </View>
  );

  const normalOption = (item) => (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        {
          backgroundColor: darkMode
            ? secondaryThreeFourthColor
            : secondaryColor,
        },
      ]}
      onPress={() => {
        props.OnSelectItem(item);
      }}>
      <Icon
        style={!item.icon && {width: 0}}
        name={item.icon || 'add-sharp'}
        color={item.icon ? item.color : secondaryColor}
        size={24}
      />
      <Text style={[styles.optionText, {color: item.color}]}>{item.text}</Text>
    </TouchableOpacity>
  );

  const optionElement = (item) => {
    return props.options &&
      props.selectedItem &&
      props.selectedItem.text === item.text
      ? selectedOption(item)
      : normalOption(item);
  };

  return (
    <View style={styles.mainContainer}>
      {props.options && (
        <FlatList
          data={props.options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => optionElement(item)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    flex: 0.4,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 0,
  },
  optionText: {
    marginHorizontal: 5,
    fontSize: 17,
  },
});

export default CategorySpinner;
