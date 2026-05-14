package com.example.orderflowmobile.core

import android.content.Context
import android.content.SharedPreferences

object SharedPreferencesManager {
    private const val PREF_NAME = "OrderFlowPrefs"
    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    var userId: Long
        get() = prefs.getLong("USER_ID", -1L)
        set(value) = prefs.edit().putLong("USER_ID", value).apply()

    var token: String?
        get() = prefs.getString("TOKEN", null)
        set(value) = prefs.edit().putString("TOKEN", value).apply()

    var email: String?
        get() = prefs.getString("EMAIL", null)
        set(value) = prefs.edit().putString("EMAIL", value).apply()

    fun clear() {
        prefs.edit().clear().apply()
    }
}