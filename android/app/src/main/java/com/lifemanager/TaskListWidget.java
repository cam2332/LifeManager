package com.lifemanager;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

import java.util.Objects;

/**
 * Implementation of App Widget functionality.
 */
public class TaskListWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Here we setup the intent which points to the TaskListWidgetService which will
        // provide the views for this collection.
        Intent intent = new Intent(context, TaskListWidgetService.class);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        // When intents are compared, the extras are ignored, so we need to embed the
        // extras
        // into the data so that the extras will not be ignored.
        intent.setData(Uri.parse(intent.toUri(Intent.URI_INTENT_SCHEME)));

        context.startService(intent);

        // Construct the RemoteViews object
        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.task_list_widget);
        remoteViews.setRemoteAdapter(R.id.tasks_list, intent);

        // The empty view is displayed when the collection has no items. It should be a
        // sibling
        // of the collection view.
        remoteViews.setEmptyView(R.id.tasks_list, R.id.empty_view);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
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

        if (Objects.equals(intent.getAction(), AppWidgetManager.ACTION_APPWIDGET_UPDATE)) {
            int[] appWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS);
            if (appWidgetIds != null) {
                AppWidgetManager.getInstance(context).notifyAppWidgetViewDataChanged(appWidgetIds, R.id.tasks_list);
            }
        }
//        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
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
