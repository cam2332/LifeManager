import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DarkMode,
  SecondaryNegativeColor,
  PrimaryColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';

const SnackBar = (props) => {
  const OnHideCallback = props.OnHide;
  let timer = useRef();

  // component did mount
  useEffect(() => {
    props.visible &&
      (timer.current = setTimeout(() => {
        OnHideCallback();
      }, props.data.duration || 2000));
  }, [OnHideCallback, props.data.duration, props.visible]);

  // component will unmount
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  });

  return props.visible ? (
    <View style={styles.content}>
      <View style={styles.descriptionView}>
        <Text
          style={[
            styles.description,
            !props.data.buttonVisible ? styles.flex89 : styles.flex100,
          ]}>
          {props.data.description || 'placeholder'}
        </Text>
      </View>
      {!props.data.buttonVisible && (
        <TouchableOpacity
          onPress={() => props.OnPressButton()}
          style={styles.button}>
          <Text style={styles.buttonText}>
            {props.data.buttonText || 'placeholder'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  descriptionView: {flex: 1},
  content: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
    left: 17,
    right: 17,
    backgroundColor: DarkMode
      ? SecondaryThreeFourthColor
      : SecondaryThreeFourthColor,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 7,
  },
  flex89: {
    flex: 0.89,
  },
  flex100: {
    flex: 1,
  },
  description: {
    flexWrap: 'wrap',
    color: SecondaryNegativeColor,
    fontSize: 14,
    marginVertical: 4,
  },
  button: {
    paddingLeft: 10,
    marginVertical: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: PrimaryColor,
  },
});

export default SnackBar;
