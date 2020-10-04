import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {
  DarkMode,
  SecondaryNegativeColor,
  PrimaryColor,
  SecondaryColor,
  SecondaryOneFourthColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';

const SnackBar = forwardRef((props, ref) => {
  const [height, setHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);

  const showTimer = useRef();
  const hideTimer = useRef();
  const animationTimer = useRef();
  const animationDuration = 150;
  const [animatedValue] = useState(new Animated.Value(0));

  useImperativeHandle(ref, () => ({
    ShowSnackBar(newDescription, newDuration, newButtonText, newButtonVisible) {
      setDescription(newDescription);
      setDuration(newDuration);
      setButtonText(newButtonText);
      setButtonVisible(newButtonVisible);
      showTimer.current = setTimeout(() => {
        setVisible(true);
        ShowAnimation();
      }, 100);
    },
  }));

  const ShowAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(HideSnackBar);
  };

  const HideAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(() => {
      animationTimer.current = setTimeout(() => {
        setVisible(false);
        props.OnHide && props.OnHide();
      }, animationDuration);
    });
  };
  const HideSnackBar = () => {
    hideTimer.current = setTimeout(() => {
      HideAnimation();
    }, (duration || 2000) + animationDuration);
  };

  // component cleanup function
  useEffect(() => {
    return () => {
      showTimer.current && clearTimeout(showTimer.current);
      animationTimer.current && clearTimeout(animationTimer.current);
      hideTimer.current && clearTimeout(hideTimer.current);
    };
  }, []);

  const OnPressButton = () => {
    props.OnPressButton();
    HideSnackBar();
  };

  const position = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Math.abs(height) * -1, 24],
  });

  return (
    <Animated.View
      onLayout={(e) => {
        setHeight(e.nativeEvent.layout.height);
      }}
      style={[
        styles.content,
        {bottom: position},
        visible ? {opacity: 1} : {opacity: 0},
      ]}>
      <View style={styles.descriptionView}>
        <Text
          style={[
            styles.description,
            buttonVisible ? styles.flex89 : styles.flex100,
          ]}>
          {description || 'placeholder'}
        </Text>
      </View>
      {buttonVisible && (
        <TouchableOpacity onPress={() => OnPressButton()} style={styles.button}>
          <Text style={styles.buttonText}>{buttonText || 'placeholder'}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  descriptionView: {flex: 1},
  content: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 17,
    right: 17,
    backgroundColor: DarkMode
      ? SecondaryThreeFourthColor
      : SecondaryOneFourthColor,
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
    color: DarkMode ? SecondaryNegativeColor : SecondaryColor,
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
