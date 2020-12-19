import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  darkMode,
  primaryColor,
  secondaryColor,
  SECONDARY_HALF_COLOR,
  secondaryThreeFourthColor,
} from '../AppConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from 'color';
import * as CategoryApi from '../services/CategoryApi';

const TaskCard = (props) => {
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    CategoryApi.GetCategoryById(props.task.categoryId)
      .then((newCategory) => {
        setCardColor(
          props.task.done
            ? (newCategory &&
                newCategory.text &&
                Color(newCategory.color).alpha(0.3).toString()) ||
                Color(primaryColor).alpha(0.3).toString()
            : (newCategory && newCategory.text && newCategory.color) ||
                primaryColor,
        );
      })
      .catch((error) => console.log(error));
  }, [props.task.done, props.task.categoryId]);

  return (
    <TouchableOpacity
      onLongPress={props.OnLongPressCard}
      style={[
        styles.mainContainer,
        {borderColor: cardColor},
        {backgroundColor: darkMode ? '#1a1a1a' : secondaryColor},
        props.selected && {borderStyle: 'solid'},
      ]}>
      <View
        style={{
          flex: 0.02,
          backgroundColor: cardColor,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.OnChangeIsDone();
        }}
        style={[
          styles.leftMargin,
          props.task.note && props.task.note !== ''
            ? {paddingVertical: 10}
            : {paddingVertical: 5},
        ]}>
        {!props.selectMode && (
          <View style={styles.checkbox}>
            {props.task.done && (
              <Icon name="md-checkbox" color={cardColor} size={26} />
            )}
            {!props.task.done && (
              <Icon name="md-square-outline" color={cardColor} size={26} />
            )}
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.OnPressCard();
        }}
        onLongPress={() => {
          props.OnLongPressCard();
        }}
        style={styles.innerContainer}>
        <Text
          style={[
            styles.title,
            props.task.done
              ? {
                  color: cardColor,
                  textDecorationLine: 'line-through',
                }
              : {
                  color: cardColor,
                },
          ]}>
          {props.task.title}
        </Text>
        <View style={styles.taskProperties}>
          {props.task.note !== '' && (
            <Text
              style={[
                styles.propertyText,
                {
                  color: props.task.done
                    ? Color(SECONDARY_HALF_COLOR).alpha(0.3).toString()
                    : SECONDARY_HALF_COLOR,
                },
              ]}>
              {props.task.note.length > 100
                ? props.task.note.substring(0, 100) + '...'
                : props.task.note}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.OnChangeIsFavorite();
        }}
        style={[
          styles.leftMargin,
          props.task.note && props.task.note !== ''
            ? {paddingVertical: 10}
            : {paddingVertical: 5},
        ]}>
        {!props.selectMode && (
          <View style={styles.checkbox}>
            {props.task.favorite && (
              <Icon name="star-sharp" color={'#F2A30F'} size={19} />
            )}
            {!props.task.favorite && (
              <Icon
                name="star-outline"
                color={secondaryThreeFourthColor}
                size={17}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
      <View style={{flex: 0.02, backgroundColor: cardColor}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginHorizontal: 17,
    marginVertical: 13,
    borderRadius: 3,
    elevation: 6,
  },
  leftMargin: {
    flex: 0.1,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  checkbox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  innerContainer: {
    flex: 0.88,
    paddingVertical: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  horizontalSpacer: {
    height: 8,
  },
  taskProperties: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyText: {
    fontSize: 13,
  },
  propertyIcon: {
    marginHorizontal: 5,
  },
  taskPropertiesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskPropertiesRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    height: '70%',
    width: 1,
  },
});

export default TaskCard;
