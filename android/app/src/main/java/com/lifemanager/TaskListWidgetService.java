package com.lifemanager;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import android.widget.RemoteViewsService.RemoteViewsFactory;

import androidx.annotation.RequiresApi;
import androidx.appcompat.content.res.AppCompatResources;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class TaskListWidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new ListRemoteViewsFactory(getApplicationContext());
    }
}

class ListRemoteViewsFactory implements RemoteViewsFactory {
    private static final int mCount = 10;
    private List<Task> mWidgetValues = new ArrayList<>();
    private Context mContext;
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    public ListRemoteViewsFactory(Context context) {
        mContext = context;
    }

    private List<Task> getTasksList(Context context) {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
            JSONObject appData = new JSONObject(appString);
            JSONArray jsonTasks = appData.getJSONArray("tasks");
            List<Task> tasks = new ArrayList<>();
            for (int i = 0; i < jsonTasks.length(); i++) {
                Date endDate = null;
                try {
                    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
                    endDate = dateFormat.parse(jsonTasks.getJSONObject(i).getString("endDate"));
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                tasks.add(new Task(jsonTasks.getJSONObject(i).getString("id"),
                        jsonTasks.getJSONObject(i).getString("title"),
                        endDate,
                        jsonTasks.getJSONObject(i).getBoolean("done"),
                        jsonTasks.getJSONObject(i).getBoolean("favorite")));
            }
            return tasks;
        } catch (JSONException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private ColorFilter colorDrawable(int color) {
        int red = (color & 0xFF0000) / 0xFFFF;
        int green = (color & 0xFF00) / 0xFF;
        int blue = color & 0xFF;
        float[] matrix = { 0, 0, 0, 0, red, 0, 0, 0, 0, green, 0, 0, 0, 0, blue, 0, 0, 0, 1, 0 };
        return new ColorMatrixColorFilter(matrix);
    }

    @Override
    public void onCreate() {
        mWidgetValues = getTasksList(mContext);

    }

    @Override
    public void onDestroy() {
        mWidgetValues.clear();
    }

    @Override
    public int getCount() {
        return mWidgetValues.size();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public RemoteViews getViewAt(int position) {
        RemoteViews remoteViews = new RemoteViews(mContext.getPackageName(), R.layout.task_list_item);
        /*
         * Set title
         */
        remoteViews.setTextViewText(R.id.task_title, mWidgetValues.get(position).title);
        if (mWidgetValues.get(position).endDate != null) {
            /*
             * Set endDate
             */
            boolean isToday;
            boolean expired;
            Date today = new Date();
            Instant instantToday = today.toInstant().truncatedTo(ChronoUnit.DAYS);
            Instant instantEndDate = mWidgetValues.get(position).endDate.toInstant().truncatedTo(ChronoUnit.DAYS);
            isToday = instantToday.equals(instantEndDate);
            expired = instantToday.isAfter(instantEndDate);

            DateFormat dateFormat = new SimpleDateFormat(
                    isToday ? "HH:mm" : expired ? "EEE, dd MMM" : "EEE, dd MMM, HH:mm");
            remoteViews.setTextViewText(R.id.task_end_date,
                    dateFormat.format(mWidgetValues.get(position).endDate));
            if (expired) {
                remoteViews.setTextColor(R.id.task_end_date,
                        ContextCompat.getColor(mContext, R.color.task_list_item_end_date_expired));
            }
        } else {
            /*
             * Hide endDate
             */
            remoteViews.setInt(R.id.task_end_date, "setVisibility", View.GONE);
        }

        Drawable doneCheckbox;
        if (mWidgetValues.get(position).done) {
            doneCheckbox = AppCompatResources.getDrawable(mContext, R.drawable.ic_check_box_white_24dp);
            doneCheckbox.mutate()
                    .setColorFilter(colorDrawable(ContextCompat.getColor(mContext, R.color.default_primary_color)));
            doneCheckbox.setAlpha(76); // 0.3

            /*
             * Set title style
             */
            remoteViews.setTextColor(R.id.task_title,
                    ContextCompat.getColor(mContext, R.color.task_list_item_done_title));
            remoteViews.setInt(R.id.task_title, "setPaintFlags", Paint.STRIKE_THRU_TEXT_FLAG | Paint.ANTI_ALIAS_FLAG);
        } else {
            doneCheckbox = AppCompatResources.getDrawable(mContext, R.drawable.ic_check_box_outline_white_24dp);
            /*
             * Set checkbox color
             */
            doneCheckbox.mutate()
                    .setColorFilter(colorDrawable(ContextCompat.getColor(mContext, R.color.default_primary_color)));
        }

        Bitmap doneBitmap = Bitmap.createBitmap(doneCheckbox.getIntrinsicWidth(), doneCheckbox.getIntrinsicHeight(),
                Bitmap.Config.ARGB_8888);
        Canvas doneCanvas = new Canvas(doneBitmap);
        doneCheckbox.setBounds(0, 0, doneCanvas.getWidth(), doneCanvas.getHeight());
        doneCheckbox.draw(doneCanvas);
        remoteViews.setImageViewBitmap(R.id.task_done, doneBitmap);

        Drawable favoriteCheckbox;
        if (mWidgetValues.get(position).favorite) {
            favoriteCheckbox = AppCompatResources.getDrawable(mContext, R.drawable.ic_star_white_24dp);
            favoriteCheckbox.mutate().setColorFilter(
                    colorDrawable(ContextCompat.getColor(mContext, R.color.task_list_item_favorite_star)));
        } else {
            favoriteCheckbox = AppCompatResources.getDrawable(mContext, R.drawable.ic_star_border_white_24dp);
            favoriteCheckbox.mutate().setColorFilter(
                    colorDrawable(ContextCompat.getColor(mContext, R.color.task_list_item_favorite_star_outline)));
        }
        Bitmap favoriteBitmap = Bitmap.createBitmap(favoriteCheckbox.getIntrinsicWidth(),
                favoriteCheckbox.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
        Canvas favoriteCanvas = new Canvas(favoriteBitmap);
        favoriteCheckbox.setBounds(0, 0, favoriteCanvas.getWidth(), favoriteCanvas.getHeight());
        favoriteCheckbox.draw(favoriteCanvas);
        remoteViews.setImageViewBitmap(R.id.task_favorite, favoriteBitmap);

        // Bundle extras = new Bundle();
        // extras.putInt(TaskListWidget.EXTRA_ITEM, position);
        // Intent fillInIntent = new Intent();
        // fillInIntent.putExtras(extras);
        // remoteViews.setOnClickFillInIntent(R.id.task_list_item, fillInIntent);
        return remoteViews;
    }

    @Override
    public RemoteViews getLoadingView() {
        return null;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public void onDataSetChanged() {
        mWidgetValues = getTasksList(mContext);
    }
}
