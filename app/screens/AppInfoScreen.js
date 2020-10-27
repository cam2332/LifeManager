import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  darkMode,
  primaryColor,
  secondaryColor,
  secondaryThreeFourthColor,
  secondaryNegativeColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';

const AppInfoScreen = (props) => {
  return (
    <View style={[styles.mainContainer, {backgroundColor: secondaryColor}]}>
      <ScreenHeader
        title="Informacje"
        textColor={darkMode ? secondaryNegativeColor : primaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : primaryColor}
        backgroundColor={darkMode ? secondaryThreeFourthColor : secondaryColor}
        borderColor={darkMode ? secondaryThreeFourthColor : primaryColor}
        sideMenuButtonVisible={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default AppInfoScreen;
