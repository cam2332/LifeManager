package com.lifemanager;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.widget.RemoteViews;

import java.util.Arrays;
import java.util.Objects;

/**
 * Implementation of App Widget functionality.
 */
public class NoteWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {

        Note<String, String, String, String> widgetValues = NoteWidgetConfigureActivity.loadTitlePref(context,
                appWidgetId);

        int backgroundColor;
        try {
            backgroundColor = Color.parseColor(widgetValues.color);
        } catch (IllegalArgumentException e) {
            backgroundColor = Color.parseColor(context.getString(R.string.default_primary_color));
        }
        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.note_widget);
        views.setTextViewText(R.id.note_widget_title, widgetValues.title);
        views.setTextViewText(R.id.note_widget_text, widgetValues.text);
        views.setInt(R.id.note_widget_background_color, "setBackgroundColor", backgroundColor);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        // When the user deletes the widget, delete the preference associated with it.
        for (int appWidgetId : appWidgetIds) {
            NoteWidgetConfigureActivity.deleteTitlePref(context, appWidgetId);
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        if (Objects.equals(intent.getAction(), AppWidgetManager.ACTION_APPWIDGET_UPDATE)) {
            Log.i("Java Note widget", "onReceive");
            int[] appWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS);
            Log.i("Java Note widget", "appWidgetIds" + Arrays.toString(appWidgetIds));
            if (appWidgetIds != null) {
                for (int appWidgetId : appWidgetIds) {
                    updateAppWidget(context, appWidgetManager, appWidgetId);
                }
            }
        }
//        if (intent.getAction().equals(TOAST_ACTION)) {
//            int appWidgetId = intent.getIntExtra(
//                    AppWidgetManager.EXTRA_APPWIDGET_ID,
//                    AppWidgetManager.INVALID_APPWIDGET_ID
//            );
//            int viewIndex = intent.getIntExtra(EXTRA_ITEM, 0);
//            Toast.makeText(context, "Touched view " + viewIndex,
//                    Toast.LENGTH_SHORT).show();
//        }
    }
}
