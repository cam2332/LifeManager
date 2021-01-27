package com.lifemanager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class SharedStorage extends ReactContextBaseJavaModule {
    ReactApplicationContext context;

    public SharedStorage(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "SharedStorage";
    }

    @ReactMethod
    public void set(String message) {
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        editor.putString("appData", message);
        editor.commit();

        Intent noteWidgetIntent = new Intent(getCurrentActivity().getApplicationContext(), NoteWidget.class);
        noteWidgetIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

        Intent taskListWidgetIntent = new Intent(getCurrentActivity().getApplicationContext(), TaskListWidget.class);
        taskListWidgetIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

        int[] notesWidgetIds = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext())
                .getAppWidgetIds(new ComponentName(getCurrentActivity().getApplicationContext(), NoteWidget.class));
        noteWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, notesWidgetIds);
        getCurrentActivity().getApplicationContext().sendBroadcast(noteWidgetIntent);

        int[] tasksWidgetIds = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext())
                .getAppWidgetIds(new ComponentName(getCurrentActivity().getApplicationContext(), TaskListWidget.class));
        taskListWidgetIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, tasksWidgetIds);
        getCurrentActivity().getApplicationContext().sendBroadcast(taskListWidgetIntent);
    }
}