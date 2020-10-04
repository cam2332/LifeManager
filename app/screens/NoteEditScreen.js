import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  DarkMode,
  PrimaryColor,
  PrimaryDarkColor,
  SecondaryColor,
  SecondaryHalfColor,
  SecondaryNegativeColor,
  DialogBackgroundColor,
} from '../AppConfig';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import * as LocalizationHelperFunctions from '../LocalizationHelperFunctions';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import SnackBar from '../components/SnackBar';
import * as NoteApi from '../services/NoteApi';

const NoteEditScreen = (props) => {
  const [title, setTitle] = useState(props.note.title);
  const [text, setText] = useState(props.note.text);
  const [createDate, setCreateDate] = useState(props.note.createDate);
  const [lastEditDate, setLastEditDate] = useState(props.note.lastEditDate);
  const [editingText, setEditingText] = useState(false);
  const [
    deleteNoteConfirmDialogVisible,
    setDeleteNoteConfirmDialogVisible,
  ] = useState(false);
  const snackBarRef = useRef();

  const noteTitleInputRef = useRef();
  const noteTextInputRef = useRef();
  let noteCreateDate = createDate ? new Date(createDate) : new Date();
  let noteLastEditDate = lastEditDate ? new Date(lastEditDate) : new Date();

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      'NoteEditScreen',
      deleteNoteConfirmDialogVisible
        ? DarkMode
          ? SecondaryColor
          : DialogBackgroundColor
        : SecondaryColor,
    );
  }, [deleteNoteConfirmDialogVisible]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', OnPressBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', OnPressBack);
  });

  const OnPressBack = () => {
    props.OnPressBack({
      ...props.note,
      title,
      text,
      createDate,
      lastEditDate,
    });
  };

  const TitleInputEndEditing = () => {
    NoteApi.ChangeNoteTitle(props.note.id, title)
      .then((editDate) => {
        setLastEditDate(editDate);
        //noteTextInputRef.current.focus();
      })
      .catch((oldTitle) => {
        setTitle(oldTitle);
        ShowSnackBar(
          'Wystąpił błąd podczas zmiany tytułu notatki.',
          2000,
          false,
        );
      });
  };
  const TextInputStartEditing = () => {
    setEditingText(true);
  };
  const TextInputEndEditing = () => {
    setEditingText(false);
  };
  const OnApplyTextChange = () => {
    NoteApi.ChangeNoteText(props.note.id, text)
      .then((editDate) => {
        setLastEditDate(editDate);
        noteTextInputRef.current.blur();
      })
      .catch((oldText) => {
        noteTextInputRef.current.blur();
        setText(oldText);
        ShowSnackBar(
          'Wystąpił błąd podczas zmiany treści notatki.',
          2000,
          false,
        );
      });
  };
  const DeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(true);
  };
  const ConfirmDeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(false);
    NoteApi.DeleteNote(props.note.id)
      .then(() => {
        NavigationHelperFunctions.MoveBackOneScreen(
          NavigationHelperFunctions.noteStackId,
        );
        props.OnDeleteNote(props.note.id);
      })
      .catch(() => {
        ShowSnackBar('Wystąpił błąd podczas usuwania notatki.', 2000, false);
      });
  };

  const ShowSnackBar = (
    description,
    duration,
    buttonVisible = false,
    buttonText = '',
  ) => {
    snackBarRef.current.ShowSnackBar(
      description,
      duration,
      buttonText,
      buttonVisible,
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScreenHeader
        iconsColor={DarkMode ? SecondaryHalfColor : PrimaryColor}
        backgroundColor={SecondaryColor}
        borderColor={DarkMode ? PrimaryDarkColor : PrimaryColor}
        OnPressBack={OnPressBack}
        backButtonVisible={!editingText}
        rightCustomButton={{
          iconName: 'trash-sharp',
          onPress: DeleteNote,
        }}
        rightCustomButtonVisible={true}
        leftCustomButton={{
          iconName: 'checkmark-sharp',
          onPress: OnApplyTextChange,
        }}
        leftCustomButtonVisible={editingText}
        stackId={NavigationHelperFunctions.noteStackId}
      />
      <View style={styles.noteContainer}>
        <TextInput
          ref={noteTitleInputRef}
          style={styles.titleTextInput}
          defaultValue={title}
          placeholder={'Tytuł notatki'}
          placeholderTextColor={SecondaryHalfColor}
          onChangeText={(newText) => setTitle(newText)}
          onEndEditing={TitleInputEndEditing}
        />
        <ScrollView style={styles.textScrollView}>
          <KeyboardAvoidingView behavior={'height'}>
            <TextInput
              ref={noteTextInputRef}
              style={styles.textInput}
              defaultValue={text}
              placeholder={'Treść notatki'}
              placeholderTextColor={SecondaryHalfColor}
              multiline={true}
              onChangeText={(newText) => setText(newText)}
              onFocus={() => TextInputStartEditing()}
              onEndEditing={() => TextInputEndEditing()}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.createDateText}>
          Utworzona: {LocalizationHelperFunctions.time(noteCreateDate)}
          {'\n'}
          {LocalizationHelperFunctions.datePL(noteCreateDate)}
        </Text>
        <Text style={styles.lastEditDate}>
          Edytowana: {LocalizationHelperFunctions.time(noteLastEditDate)}
          {'\n'}
          {LocalizationHelperFunctions.datePL(noteLastEditDate)}
        </Text>
      </View>
      <ConfirmDialog
        visible={deleteNoteConfirmDialogVisible}
        title="Usuń"
        description="Czy na pewno chcesz usunąć tą notatkę?"
        confirmText="Usuń"
        OnPressConfirm={() => {
          console.log('confirm');
          ConfirmDeleteNote();
        }}
        OnPressCancel={() => {
          setDeleteNoteConfirmDialogVisible(false);
        }}
      />
      <SnackBar ref={snackBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SecondaryColor,
  },
  noteContainer: {
    flex: 1,
  },
  titleTextInput: {
    fontSize: 28,
    marginHorizontal: 45,
    color: SecondaryNegativeColor,
  },
  textScrollView: {
    marginVertical: 10,
    paddingHorizontal: 45,
  },
  textInput: {
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 30,
    color: SecondaryHalfColor,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  createDateText: {
    fontSize: 11,
    textAlign: 'center',
    color: SecondaryHalfColor,
  },
  lastEditDate: {
    fontSize: 11,
    textAlign: 'center',
    color: SecondaryHalfColor,
  },
});

export default NoteEditScreen;
