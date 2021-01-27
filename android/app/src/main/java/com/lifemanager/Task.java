package com.lifemanager;

import java.util.Date;

public class Task {
    String id;
    String title;
    Date endDate;
    boolean done;
    boolean favorite;

    public Task(String id, String title, Date endDate, boolean done, boolean favorite) {
        this.id = id;
        this.title = title;
        this.endDate = endDate;
        this.done = done;
        this.favorite = favorite;
    }
}
