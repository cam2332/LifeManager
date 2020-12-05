import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {secondaryNegativeColor} from '../AppConfig';
import * as ColorApi from '../services/ColorApi';
import {ChunkArray} from '../HelperFunctions';

const ColorSelector = (props) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    ColorApi.getColors()
      .then((newColors) => {
        setColors(newColors);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={ChunkArray(colors, props.numberOfColumns)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={item}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      props.OnSelectColor(item);
                    }}>
                    <View
                      style={[
                        styles.colorButton,
                        {
                          backgroundColor: item,
                        },
                        {
                          borderColor:
                            props.selectedColor === item
                              ? secondaryNegativeColor
                              : item,
                        },
                        props.selectedColor === item
                          ? styles.selectedColorButton
                          : styles.normalColorButton,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
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
});

export default ColorSelector;
