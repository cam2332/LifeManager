import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  darkMode,
  primaryColor,
  primaryDarkColor,
  secondaryColor,
  secondaryNegativeColor,
  secondaryThreeFourthColor,
} from '../AppConfig';
import ScreenHeader from '../components/ScreenHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import NoteCard from '../components/NoteCard';
import * as NoteApi from '../services/NoteApi';
import SnackBar from '../components/SnackBar';

const NoteMainScreen = (props) => {
  const [noteList, setNoteList] = useState([]);
  const [selectedNoteList, setSelectedNoteList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const snackBarRef = useRef();

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      NavigationHelperFunctions.NOTE_MAIN_SCREEN_ID,
      secondaryColor,
    );
    NavigationHelperFunctions.SetCurrentScreenId(props.componentId);
  });

  useEffect(() => {
    UpdateNoteList();
  }, []);

  const UpdateNoteList = () => {
    NoteApi.GetAllNotes()
      .then((notes) => {
        setNoteList(notes);
        setIsFetching(false);
      })
      .catch(() => {
        setNoteList([]);
        setIsFetching(false);
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas ładowania notatek.',
          4000,
          'Ponów',
          true,
          () => UpdateNoteList,
        );
      });
  };

  const onRefresh = () => {
    setIsFetching(true);
    UpdateNoteList();
    setSelectMode(false);
    setSelectedNoteList([]);
  };

  const UpdateListFromSearch = (text) => {
    NoteApi.GetNotesByTitleAndText(text)
      .then((notes) => {
        setNoteList(notes);
        setIsFetching(false);
      })
      .catch(() => {
        setNoteList([]);
        setIsFetching(false);
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas ładowania notatek.',
          4000,
          '',
          false,
        );
      });
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

  const AddNote = () => {
    OpenEditNoteScreen({});
  };

  const DeleteSelectedNotes = () => {
    setIsDeleting(true);
    NoteApi.DeleteNotes(selectedNoteList)
      .then((success) => {
        setNoteList(
          noteList.filter((note) => !selectedNoteList.includes(note.id)),
        );
        setSelectMode(false);
        setSelectedNoteList([]);
        setIsDeleting(false);
      })
      .catch(() => {
        snackBarRef.current.ShowSnackBar(
          'Wystąpił błąd podczas usuwania notatek.',
          4000,
          'Ponów',
          true,
          () => DeleteSelectedNotes,
        );
      });
  };

  const OnDeleteNote = (noteId) => {
    setNoteList(noteList.filter((note) => note.id !== noteId));
  };

  const OpenEditNoteScreen = (note) => {
    NavigationHelperFunctions.NavigateToNoteEditScreen({
      note,
      OnDeleteNote: (noteId) => OnDeleteNote(noteId),
      OnPressBack: (updatedNote) => {
        if (Object.keys(note).length === 0) {
          if (Object.keys(updatedNote).length > 0 && updatedNote.id) {
            setNoteList([...noteList, updatedNote]);
          }
        } else {
          const index = noteList.findIndex(
            (note1) => note1.id === updatedNote.id,
          );
          if (index > -1) {
            noteList[index] = updatedNote;
            setNoteList([...noteList]);
          }
        }
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        title={selectMode ? selectedNoteList.length.toString() : 'Notatki'}
        textColor={darkMode ? secondaryNegativeColor : secondaryColor}
        iconsColor={darkMode ? secondaryNegativeColor : secondaryColor}
        backgroundColor={darkMode ? secondaryThreeFourthColor : primaryColor}
        borderColor={darkMode ? secondaryThreeFourthColor : primaryColor}
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
              backgroundColor={darkMode ? primaryDarkColor : primaryColor}
              titleColor={darkMode ? secondaryNegativeColor : secondaryColor}
              textColor={darkMode ? secondaryNegativeColor : secondaryColor}
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
                !isDeleting && !selectMode && OpenEditNoteScreen(item);
              }}
              selected={selectedNoteList.includes(item.id)}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={[styles.floatingButton, {backgroundColor: primaryColor}]}
        onPress={() => (selectMode ? DeleteSelectedNotes() : AddNote())}>
        <Icon
          name={selectMode ? 'trash-sharp' : 'add-sharp'}
          size={30}
          color={darkMode ? secondaryNegativeColor : secondaryColor}
        />
      </TouchableOpacity>
      <SnackBar ref={snackBarRef} />
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
    borderRadius: 30,
    elevation: 7,
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
