package com.lifemanager;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class NoteWidgetConfigureActivity extends Activity {

    int mAppWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private static final String PREFS_NAME = "AppWidget";
    private static final String PREF_PREFIX_KEY = "appwidget";

    public NoteWidgetConfigureActivity() {
        super();
    }

    private List<Note<String, String, String, String>> getNotesList() {
        try {
            SharedPreferences sharedPref = getApplicationContext().getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
            JSONObject appData = new JSONObject(appString);
            JSONArray jsonNotes = appData.getJSONArray("notes");
            List<Note<String, String, String, String>> notes = new ArrayList<>();
            for (int i = 0; i < jsonNotes.length(); i++) {
                notes.add(new Note<>(jsonNotes.getJSONObject(i).getString("id"),
                        jsonNotes.getJSONObject(i).getString("title"),
                        jsonNotes.getJSONObject(i).getString("text"),
                        jsonNotes.getJSONObject(i).getString("color")));
            }
            return notes;
        } catch (JSONException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public void onCreate(Bundle icicle) {
        super.onCreate(icicle);

        // Set the result to CANCELED. This will cause the widget host to cancel
        // out of the widget placement if the user presses the back button.
        setResult(RESULT_CANCELED);

        setContentView(R.layout.note_widget_configure);
        final ListView listView = findViewById(R.id.notes_list);

        List<Note<String, String, String, String>> notes = getNotesList();

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, android.R.id.text1,
                notes.stream().map(note -> note.title).collect(Collectors.toList()));

        listView.setAdapter(adapter);

        // ListView Item Click Listener
        listView.setOnItemClickListener((parent, view, position, id) -> createWidget(getApplicationContext(), notes.get(position)));

        // Find the widget id from the intent.
        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            mAppWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        // If this activity was started with an intent without an app widget ID, finish
        // with an error.
        if (mAppWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
        }

    }

    private void createWidget(Context context, Note<String, String, String, String> widgetValues) {
        // Store the string locally
        saveTitlePref(context, mAppWidgetId, widgetValues);

        // It is the responsibility of the configuration activity to update the app
        // widget
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        NoteWidget.updateAppWidget(context, appWidgetManager, mAppWidgetId);

        // Make sure we pass back the original appWidgetId
        Intent resultValue = new Intent();
        resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, mAppWidgetId);
        setResult(RESULT_OK, resultValue);
        finish();
    }

    // Write the prefix to the SharedPreferences object for this widget
    static void saveTitlePref(Context context, int appWidgetId, Note<String, String, String, String> values) {
        SharedPreferences.Editor prefs = context.getSharedPreferences(PREFS_NAME, 0).edit();
        prefs.putString(PREF_PREFIX_KEY + appWidgetId + "id", values.id);
        prefs.putString(PREF_PREFIX_KEY + appWidgetId + "title", values.title);
        prefs.putString(PREF_PREFIX_KEY + appWidgetId + "text", values.text);
        prefs.putString(PREF_PREFIX_KEY + appWidgetId + "color", values.color);
        prefs.apply();
    }

    // Read the prefix from the SharedPreferences object for this widget.
    // If there is no preference saved, get the default from a resource
    static Note<String, String, String, String> loadTitlePref(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, 0);
        String idValue = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "id", "");
        String titleValue = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "title", "");
        String textValue = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "text", "");
        String colorValue = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "color", "");
        return new Note<>(idValue, titleValue, textValue, colorValue);
    }

    static void deleteTitlePref(Context context, int appWidgetId) {
        SharedPreferences.Editor prefs = context.getSharedPreferences(PREFS_NAME, 0).edit();
        prefs.remove(PREF_PREFIX_KEY + appWidgetId + "id");
        prefs.remove(PREF_PREFIX_KEY + appWidgetId + "title");
        prefs.remove(PREF_PREFIX_KEY + appWidgetId + "text");
        prefs.remove(PREF_PREFIX_KEY + appWidgetId + "color");
        prefs.apply();
    }
}