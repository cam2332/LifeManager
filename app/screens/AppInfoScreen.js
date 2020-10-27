import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  darkMode,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SECONDARY_THREE_FOURTH_COLOR,
  SECONDARY_NEGATIVE_COLOR,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';

const AppInfoScreen = (props) => {
  return (
    <View style={[styles.mainContainer, {backgroundColor: SECONDARY_COLOR}]}>
      <ScreenHeader
        title="Informacje"
        textColor={darkMode ? SECONDARY_NEGATIVE_COLOR : PRIMARY_COLOR}
        iconsColor={darkMode ? SECONDARY_NEGATIVE_COLOR : PRIMARY_COLOR}
        backgroundColor={
          darkMode ? SECONDARY_THREE_FOURTH_COLOR : SECONDARY_COLOR
        }
        borderColor={darkMode ? SECONDARY_THREE_FOURTH_COLOR : PRIMARY_COLOR}
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
