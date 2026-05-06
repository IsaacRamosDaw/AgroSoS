package com.example.agrosospgl.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.agrosospgl.models.User;

public class SessionManager {
    private static final String PREF_NAME = "AgroSoSSession";
    private static final String KEY_USER_ID = "userId";
    private static final String KEY_USER_NAME = "userName";
    private static final String KEY_USER_EMAIL = "userEmail";
    private static final String KEY_USER_ROLE = "userRole";

    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveSession(User user) {
        prefs.edit()
                .putInt(KEY_USER_ID, user.getId())
                .putString(KEY_USER_NAME, user.getName())
                .putString(KEY_USER_EMAIL, user.getEmail())
                .putString(KEY_USER_ROLE, user.getRole())
                .apply();
    }

    public void clearSession() {
        prefs.edit().clear().apply();
    }

    public boolean isLoggedIn() {
        return prefs.contains(KEY_USER_ID);
    }

    public int getUserId() {
        return prefs.getInt(KEY_USER_ID, -1);
    }

    public String getUserName() {
        return prefs.getString(KEY_USER_NAME, "");
    }

    public String getUserEmail() {
        return prefs.getString(KEY_USER_EMAIL, "");
    }

    public String getUserRole() {
        return prefs.getString(KEY_USER_ROLE, "USER");
    }

    public boolean isAdmin() {
        return "ADMIN".equals(getUserRole());
    }
}
