import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchIcon from '../../resources/SearchIcon.png';
import MenuIcon from '../../resources/MenuButton.png';
import {secondaryNegativeColor, SECONDARY_HALF_COLOR} from '../AppConfig';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';

const ScreenHeader = (props) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [searchButtonVisible, setSearchButtonVisible] = useState(
    props.searchButtonVisible,
  );
  const [sideMenuButtonVisible, setSideMenuButtonVisible] = useState(
    props.sideMenuButtonVisible,
  );
  const [iconsColor, setIconsColor] = useState(props.iconsColor);
  const [textColor, setTextColor] = useState(props.textColor);
  const [customIconSize, setCustomIconSize] = useState(26);

  const textInputRef = useRef(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setIconsColor(props.iconsColor);
    setTextColor(props.textColor);
  }, [props.iconsColor, props.textColor]);

  const OnPressOpenSideMenu = () => {
    NavigationHelperFunctions.OpenLeftSideMenu();
  };

  const OnPressBackButton = () => {
    NavigationHelperFunctions.MoveBackOneScreen(props.stackId);
    props.OnPressBack && props.OnPressBack();
  };

  const OnPressSearchButton = async () => {
    setSearchBarActive(true);
    await setTimeout(() => {
      textInputRef.current.focus();
    }, 100);
  };

  const OnChangeSearchText = (text) => {
    console.log(text);
    setInputText(text);
    props.OnChangeSearchText(text);
  };

  const OnEndTypingSearch = (text) => {
    setSearchBarActive(false);
    props.OnEndTypingSearch(text);
    setInputText('');
  };

  const OnCancelTypingSearch = () => {
    setSearchBarActive(false);
    props.OnCancelTypingSearch();
    setInputText('');
  };

  const sideMenuButton = (iconColor, backgroundColor) => (
    <TouchableOpacity
      style={styles.sideMenuButtonMainContainer}
      onPress={OnPressOpenSideMenu}>
      <Image
        style={[styles.sideMenuButtonIcon, {tintColor: iconColor}]}
        source={MenuIcon}
      />
    </TouchableOpacity>
  );

  const backButton = (iconColor) => (
    <TouchableOpacity
      style={styles.backButtonMainContainer}
      onPress={OnPressBackButton}>
      <Icon
        style={styles.backButtonIcon}
        name="arrow-back-sharp"
        color={iconColor}
        size={31}
      />
    </TouchableOpacity>
  );

  const leftCustomButton = (iconName, iconColor) => (
    <TouchableOpacity
      style={styles.leftCustomButtonMainContainer}
      onPress={props.leftCustomButton.onPress}>
      <Icon
        style={styles.leftCustomButtonIcon}
        name={iconName}
        color={iconColor}
        size={props.leftCustomButton.iconSize || customIconSize}
      />
    </TouchableOpacity>
  );

  const searchButton = (iconColor) => (
    <TouchableOpacity
      style={styles.searchButtonMainContainer}
      onPress={OnPressSearchButton}>
      <Image
        style={[styles.searchButtonIcon, {tintColor: iconColor}]}
        source={SearchIcon}
      />
    </TouchableOpacity>
  );

  const rightCustomButton = (iconName, iconColor) => (
    <TouchableOpacity
      style={styles.rightCustomButtonMainContainer}
      onPress={props.rightCustomButton.onPress}>
      <Icon
        style={styles.rightCustomButtonIcon}
        name={iconName}
        color={iconColor}
        size={props.rightCustomButton.iconSize || customIconSize}
      />
    </TouchableOpacity>
  );

  const searchBar = (searchBarTextPlaceholder) => (
    <View
      style={[
        styles.searchBarMainContainer,
        {backgroundColor: props.backgroundColor},
      ]}>
      <TextInput
        ref={textInputRef}
        style={styles.searchBarTextInput}
        placeholder={searchBarTextPlaceholder}
        placeholderTextColor={SECONDARY_HALF_COLOR}
        onChangeText={(text) => OnChangeSearchText(text)}
        onEndEditing={(event) => OnEndTypingSearch(inputText)}
      />
      <TouchableOpacity
        style={styles.searchBarCancelButton}
        onPress={() => OnCancelTypingSearch()}>
        <Icon
          style={styles.searchBarCancelButtonIcon}
          name="close-sharp"
          color="#888"
          size={21}
        />
      </TouchableOpacity>
    </View>
  );

  const title = (titleFontSize, titleAlignment, textColor, textTitle) => (
    <View style={styles.titleMainContainer}>
      <Text
        style={{
          fontSize: titleFontSize || 25,
          alignSelf: titleAlignment || 'center',
          color: textColor || '#fff',
        }}>
        {textTitle || ''}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: props.backgroundColor,
          borderColor: props.borderColor
            ? props.borderColor
            : props.backgroundColor,
        },
      ]}>
      {!searchBarActive && (
        <View style={styles.innerContainer}>
          {sideMenuButtonVisible &&
            !props.leftCustomButtonVisible &&
            sideMenuButton(iconsColor, props.backgroundColor)}
          {props.backButtonVisible && backButton(iconsColor)}
          {props.leftCustomButton &&
            props.leftCustomButtonVisible &&
            leftCustomButton(props.leftCustomButton.iconName, iconsColor)}
          {!props.leftCustomButtonVisible && !sideMenuButtonVisible && (
            <View style={styles.leftCustomButtonMainContainer} />
          )}
          {title(
            props.titleFontSize,
            props.titleAlignment,
            textColor,
            props.title,
          )}
          {searchButtonVisible &&
            !props.rightCustomButtonVisible &&
            searchButton(iconsColor)}
          {props.rightCustomButton &&
            props.rightCustomButtonVisible &&
            rightCustomButton(props.rightCustomButton.iconName, iconsColor)}
          {!props.rightCustomButtonVisible && !searchButtonVisible && (
            <View style={styles.rightCustomButtonMainContainer} />
          )}
        </View>
      )}
      {searchBarActive && searchBar(props.searchBarTextPlaceholder)}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 44,
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-between',
    marginHorizontal: 17,
    borderRadius: 7,
    borderWidth: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  sideMenuButtonMainContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  sideMenuButtonIcon: {
    resizeMode: 'contain',
    height: '45%',
    width: '45%',
    alignSelf: 'center',
  },
  backButtonMainContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  backButtonIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
  },
  leftCustomButtonMainContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  leftCustomButtonIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
  },
  searchButtonMainContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  searchButtonIcon: {
    resizeMode: 'contain',
    height: '45%',
    width: '45%',
    alignSelf: 'center',
  },
  rightCustomButtonMainContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
  rightCustomButtonIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
  },
  searchBarMainContainer: {
    flex: 0.985,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarTextInput: {
    marginLeft: 8,
    color: secondaryNegativeColor,
    flex: 1,
    fontSize: 16,
  },
  searchBarCancelButton: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  searchBarCancelButtonIcon: {
    alignSelf: 'flex-end',
    padding: 7,
  },
  titleMainContainer: {
    flex: 0.7,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default ScreenHeader;
