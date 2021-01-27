package com.lifemanager;

public class Note<A, B, C, D> {
    A id;
    B title;
    C text;
    D color;

    public Note(A id, B title, C text, D color) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.color = color;
    }
}
