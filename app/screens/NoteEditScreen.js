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
  darkMode,
  PRIMARY_COLOR,
  PRIMARY_DARK_COLOR,
  SECONDARY_COLOR,
  SECONDARY_HALF_COLOR,
  SECONDARY_NEGATIVE_COLOR,
  DIALOG_BACKGROUND_COLOR,
} from '../AppConfig';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import * as LocalizationHelperFunctions from '../LocalizationHelperFunctions';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import SnackBar from '../components/SnackBar';
import * as NoteApi from '../services/NoteApi';

const NoteEditScreen = (props) => {
  const [id, setId] = useState(props.note.id || '');
  const [title, setTitle] = useState(props.note.title || '');
  const [text, setText] = useState(props.note.text || '');
  const [createDate, setCreateDate] = useState(
    props.note.createDate || new Date(),
  );
  const [lastEditDate, setLastEditDate] = useState(
    props.note.lastEditDate || new Date(),
  );
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
        ? darkMode
          ? SECONDARY_COLOR
          : DIALOG_BACKGROUND_COLOR
        : SECONDARY_COLOR,
    );
  }, [deleteNoteConfirmDialogVisible]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', OnPressBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', OnPressBack);
  });

  const OnPressBack = () => {
    props.OnPressBack({
      id,
      title,
      text,
      createDate,
      lastEditDate,
    });
  };

  const TitleInputEndEditing = () => {
    NoteApi.ChangeNoteTitle(id, title)
      .then(
        ({
          id: newId,
          createDate: newCreateDate,
          lastEditDate: newLastEditDate,
        }) => {
          newId && setId(newId);
          newCreateDate && setCreateDate(newCreateDate);
          newLastEditDate && setLastEditDate(newLastEditDate);
          //noteTextInputRef.current.focus();
        },
      )
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
    NoteApi.ChangeNoteText(id, text)
      .then(
        ({
          id: newId,
          createDate: newCreateDate,
          lastEditDate: newLastEditDate,
        }) => {
          newId && setId(newId);
          newCreateDate && setCreateDate(newCreateDate);
          newLastEditDate && setLastEditDate(newLastEditDate);
          noteTextInputRef.current.blur();
        },
      )
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
    NoteApi.DeleteNote(id)
      .then(() => {
        NavigationHelperFunctions.MoveBackOneScreen(
          NavigationHelperFunctions.noteStackId,
        );
        props.OnDeleteNote(id);
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
        iconsColor={darkMode ? SECONDARY_HALF_COLOR : PRIMARY_COLOR}
        backgroundColor={SECONDARY_COLOR}
        borderColor={darkMode ? PRIMARY_DARK_COLOR : PRIMARY_COLOR}
        OnPressBack={OnPressBack}
        backButtonVisible={!editingText}
        rightCustomButton={{
          iconName: 'trash-sharp',
          onPress: DeleteNote,
        }}
        rightCustomButtonVisible={
          id !== null && id !== undefined && id.length > 0
        }
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
          placeholderTextColor={SECONDARY_HALF_COLOR}
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
              placeholderTextColor={SECONDARY_HALF_COLOR}
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
    backgroundColor: SECONDARY_COLOR,
  },
  noteContainer: {
    flex: 1,
  },
  titleTextInput: {
    fontSize: 28,
    marginHorizontal: 45,
    color: SECONDARY_NEGATIVE_COLOR,
  },
  textScrollView: {
    marginVertical: 10,
    paddingHorizontal: 45,
  },
  textInput: {
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 30,
    color: SECONDARY_HALF_COLOR,
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
    color: SECONDARY_HALF_COLOR,
  },
  lastEditDate: {
    fontSize: 11,
    textAlign: 'center',
    color: SECONDARY_HALF_COLOR,
  },
});

export default NoteEditScreen;
