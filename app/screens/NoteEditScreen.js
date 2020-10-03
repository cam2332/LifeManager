import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
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

  const OnPressBack = () => {};
  const TitleInputEndEditing = () => {
    noteTextInputRef.current.focus();
    setLastEditDate();
  };
  const TextInputStartEditing = () => {
    setEditingText(true);
  };
  const TextInputEndEditing = () => {
    setEditingText(false);
  };
  const OnApplyTextChange = () => {
    noteTextInputRef.current.blur();
    setLastEditDate();
  };
  const DeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(true);
  };
  const ConfirmDeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(false);
    NoteApi.DeleteNote(props.note.id).then((success) => {
      if (success) {
        NavigationHelperFunctions.MoveBackOneScreen(
          NavigationHelperFunctions.noteStackId,
        );
        props.OnDeleteNote(props.note.id);
      } else {
        // TODO: make message with error
      }
    });
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
          Utworzona:{' '}
          {noteCreateDate.getHours() +
            ':' +
            (noteCreateDate.getMinutes() > 9
              ? noteCreateDate.getMinutes()
              : '0' + noteCreateDate.getMinutes())}
          {'\n'}
          {LocalizationHelperFunctions.datePL(noteCreateDate)}
        </Text>
        <Text style={styles.lastEditDate}>
          Edytowana:{' '}
          {noteLastEditDate.getHours() +
            ':' +
            (noteLastEditDate.getMinutes() > 9
              ? noteLastEditDate.getMinutes()
              : '0' + noteLastEditDate.getMinutes())}
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
