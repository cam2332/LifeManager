import React, {useState, useEffect} from 'react';
import {
  View,
  RefreshControl,
  TouchableOpacity,
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
import Icon from 'react-native-vector-icons/Ionicons';
import {UpdateStatusBarColor} from '../NavigationHelperFunctions';
import NoteCard from '../components/NoteCard';

const NoteMainScreen = () => {
  const [noteList, setNoteList] = useState([]);
  const [selectedNoteList, setSelectedNoteList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setSelectMode(false);
    setSelectedNoteList([]);
  };

  const UpdateListFromSearch = (text) => {
  };

  const OnChangeSearchText = (newValue) => {
    UpdateListFromSearch(newValue);
  };

  const ToggleSelectNote = (noteId, select) => {
    if (select) {
      selectedNoteList.push(noteId);
      setSelectedNoteList([...selectedNoteList]);
    } else {
      if (selectedNoteList.length === 1) {
        setSelectMode(false);
      }
      setSelectedNoteList(
        selectedNoteList.filter((noteId1) => noteId1 !== noteId),
      );
    }
  };

  const EndSelectMode = () => {
    setSelectMode(false);
    setSelectedNoteList([]);
  };

  const AddNote = () => {};

  const DeleteSelectedNotes = () => {
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
        searchButtonVisible={!selectMode}
        rightCustomButton={{
          iconName: 'close-sharp',
          onPress: () => EndSelectMode(),
        }}
        rightCustomButtonVisible={selectMode}
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <NoteCard
              note={item}
              onDeleteCard={() => deleteNoteFromList(item.id)}
              backgroundColor={DarkMode ? PrimaryDarkColor : PrimaryColor}
              titleColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
              textColor={DarkMode ? SecondaryNegativeColor : SecondaryColor}
              OnLongPressCard={(select) => {
                !isDeleting && !selectMode && ToggleSelectNote(item.id, true);
                !isDeleting && !selectMode && setSelectMode(true);
              }}
              OnPressCard={(select) => {
                !isDeleting &&
                  selectMode &&
                  ToggleSelectNote(
                    item.id,
                    !selectedNoteList.includes(item.id),
                  );
              }}
              selected={selectedNoteList.includes(item.id)}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => (selectMode ? DeleteSelectedNotes() : AddNote())}>
        <Icon
          name={selectMode ? 'trash-sharp' : 'add-sharp'}
          size={30}
          color={DarkMode ? SecondaryNegativeColor : SecondaryColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 17,
    right: 17,
    backgroundColor: DarkMode ? PrimaryDarkColor : PrimaryColor,
    borderColor: SecondaryColor,
    borderWidth: 2,
    borderRadius: 30,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  mainContainer: {
    flex: 1,
  },
});

export default NoteMainScreen;
