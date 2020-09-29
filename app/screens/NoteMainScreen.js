import React, {useState, useEffect} from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  DarkMode,
  PrimaryColor,
  PrimaryDarkColor,
  SecondaryColor,
  SecondaryNegativeColor,
  SecondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import {UpdateStatusBarColor} from '../NavigationHelperFunctions';
import NoteCard from '../components/NoteCard';
const NoteMainScreen = () => {
  const [noteList, setNoteList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    UpdateStatusBarColor('NoteMainScreen', SecondaryColor);
  });

  useEffect(() => {
    UpdateNoteList();
  }, []);


  const UpdateNoteList = () => {
    NoteApi.GetAllNotes().then((notes) => {
      setNoteList(notes);
      setIsFetching(false);
    });
  };

  const onRefresh = () => {
    setIsFetching(true);
    UpdateNoteList();

  const UpdateListFromSearch = (text) => {
  };

  const OnChangeSearchText = (newValue) => {
    UpdateListFromSearch(newValue);
  };

  };
  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        title={selectMode ? selectedNoteList.length.toString() : 'Notatki'}
        textColor={DarkMode ? SecondaryNegativeColor : PrimaryColor}
        iconsColor={DarkMode ? SecondaryNegativeColor : PrimaryColor}
        backgroundColor={DarkMode ? SecondaryThreeFourthColor : SecondaryColor}
        borderColor={DarkMode ? SecondaryThreeFourthColor : PrimaryColor}
        sideMenuButtonVisible={true}
        searchButtonVisible={true}
        OnChangeSearchText={(text) => OnChangeSearchText(text)}
        searchBarTextPlaceholder={'Wpisz nazwę notatki'}
        OnEndTypingSearch={(text) => UpdateListFromSearch(text)}
        OnCancelTypingSearch={UpdateNoteList}
      />
      <View style={styles.listContainer}>
        <FlatList
          data={noteList}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          keyExtractor={(index) => index.toString()}
          renderItem={({item}) => (
            <NoteCard
              note={item}
              onDeleteCard={() => deleteNoteFromList(item.id)}
              backgroundColor={DarkMode ? PrimaryDarkColor : PrimaryColor}
              titleColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
              textColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  mainContainer: {
    flex: 1,
  },
});

export default NoteMainScreen;
