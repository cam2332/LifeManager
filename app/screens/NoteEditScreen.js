import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {
  darkMode,
  primaryColor,
  primaryDarkColor,
  secondaryColor,
  SECONDARY_HALF_COLOR,
  secondaryNegativeColor,
  dialogBackgroundColor,
} from '../AppConfig';
import * as NavigationHelperFunctions from '../NavigationHelperFunctions';
import * as LocalizationHelperFunctions from '../LocalizationHelperFunctions';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import SnackBar from '../components/SnackBar';
import * as NoteApi from '../services/NoteApi';
import ColorSelectorDialog from '../components/dialogs/ColorSelectorDialog';

const NoteEditScreen = (props) => {
  const [id, setId] = useState(props.note.id);
  const [title, setTitle] = useState(props.note.title || '');
  const [text, setText] = useState(props.note.text || '');
  const [createDate, setCreateDate] = useState(
    props.note.createDate || new Date(),
  );
  const [lastEditDate, setLastEditDate] = useState(
    props.note.lastEditDate || new Date(),
  );
  const [color, setColor] = useState(props.note.color || primaryColor);
  const [editingText, setEditingText] = useState(false);
  const [
    deleteNoteConfirmDialogVisible,
    setDeleteNoteConfirmDialogVisible,
  ] = useState(false);
  const [colorSelectorDialogVisible, setColorSelectorDialogVisible] = useState(
    false,
  );
  const snackBarRef = useRef();

  const noteTitleInputRef = useRef();
  const noteTextInputRef = useRef();
  let noteCreateDate = createDate ? new Date(createDate) : new Date();
  let noteLastEditDate = lastEditDate ? new Date(lastEditDate) : new Date();

  useEffect(() => {
    NavigationHelperFunctions.UpdateStatusBarColor(
      NavigationHelperFunctions.NOTE_EDIT_SCREEN_ID,
      colorSelectorDialogVisible || deleteNoteConfirmDialogVisible
        ? darkMode
          ? secondaryColor
          : dialogBackgroundColor
        : secondaryColor,
    );
  }, [deleteNoteConfirmDialogVisible, colorSelectorDialogVisible]);

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
      color,
    });
  };

  const TitleInputEndEditing = () => {
    if (id === null || id === undefined || id.length === 0) {
      NoteApi.CreateNote({title: title, text: text})
        .then((createdNote) => {
          setId(createdNote.id);
          setCreateDate(createdNote.createDate);
          setLastEditDate(createdNote.lastEditDate);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      NoteApi.ChangeNoteTitle(id, title)
        .then(() => {
          setLastEditDate(new Date());
          //noteTextInputRef.current.focus();
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    }
  };

  const TextInputStartEditing = () => {
    setEditingText(true);
  };

  const TextInputEndEditing = () => {
    setEditingText(false);
  };

  const OnApplyTextChange = () => {
    if (id === null || id === undefined || id.length === 0) {
      NoteApi.CreateNote({title: title, text: text})
        .then((createdNote) => {
          setId(createdNote.id);
          setCreateDate(createdNote.createDate);
          setLastEditDate(createdNote.lastEditDate);
          noteTextInputRef.current.blur();
        })
        .catch((error) => {
          noteTextInputRef.current.blur();
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    } else {
      NoteApi.ChangeNoteText(id, text)
        .then(() => {
          setLastEditDate(new Date());
          noteTextInputRef.current.blur();
        })
        .catch((error) => {
          noteTextInputRef.current.blur();
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    }
  };

  const OnSelectColor = (newColor) => {
    if (id === undefined) {
      setColor(newColor);
    } else {
      NoteApi.ChangeNoteColor(id, newColor)
        .then(() => {
          setColor(newColor);
          setLastEditDate(new Date());
          setColorSelectorDialogVisible(false);
        })
        .catch((error) => {
          snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
        });
    }
  };

  const DeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(true);
  };

  const ConfirmDeleteNote = () => {
    setDeleteNoteConfirmDialogVisible(false);
    NoteApi.DeleteNote(id)
      .then(() => {
        NavigationHelperFunctions.MoveBackOneScreen(
          NavigationHelperFunctions.NOTE_STACK_ID,
        );
        props.OnDeleteNote(id);
      })
      .catch((error) => {
        snackBarRef.current.ShowSnackBar(error?.message, 2000, false);
      });
  };

  return (
    <View style={[styles.mainContainer, {backgroundColor: secondaryColor}]}>
      <ScreenHeader
        iconsColor={color}
        backgroundColor={secondaryColor}
        borderColor={secondaryColor}
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
        rightCustomView={
          <TouchableOpacity
            style={[styles.colorButton, {backgroundColor: color}]}
            onPress={() => setColorSelectorDialogVisible(true)}
          />
        }
        rightCustomViewVisible={true}
        stackId={NavigationHelperFunctions.NOTE_STACK_ID}
      />
      <View style={styles.noteContainer}>
        <TextInput
          ref={noteTitleInputRef}
          style={[styles.titleTextInput, {color: color}]}
          defaultValue={title}
          placeholder={'Tytuł notatki'}
          placeholderTextColor={SECONDARY_HALF_COLOR}
          onChangeText={(newText) => setTitle(newText)}
          onEndEditing={TitleInputEndEditing}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.textTouchableOpacity}
          onPress={() => noteTextInputRef && noteTextInputRef.current.focus()}>
          <ScrollView style={styles.textScrollView}>
            <KeyboardAvoidingView>
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
        </TouchableOpacity>
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
      <ColorSelectorDialog
        visible={colorSelectorDialogVisible}
        selectedColor={color}
        OnSelectColor={(newColor) => {
          OnSelectColor(newColor);
        }}
        OnPressExit={() => {
          setColorSelectorDialogVisible(false);
        }}
      />
      <SnackBar ref={snackBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  noteContainer: {
    flex: 1,
  },
  titleTextInput: {
    fontSize: 28,
    marginHorizontal: 40,
    color: secondaryNegativeColor,
  },
  textTouchableOpacity: {
    flex: 1,
  },
  textScrollView: {
    marginVertical: 10,
    paddingHorizontal: 40,
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
  colorButton: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoteEditScreen;
