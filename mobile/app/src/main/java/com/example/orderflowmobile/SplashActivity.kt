package com.example.orderflowmobile

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.example.orderflowmobile.auth.LoginActivity
import com.example.orderflowmobile.core.SharedPreferencesManager
import com.example.orderflowmobile.menu.DashboardActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Hide the top action bar so the red fills the whole screen safely
        supportActionBar?.hide()

        // Initialize SharedPreferences
        SharedPreferencesManager.init(this)

        // Wait for 2 seconds (2000 milliseconds), then route the user
        Handler(Looper.getMainLooper()).postDelayed({
            
            // Smart Routing! Check if they already logged in previously
            val userId = SharedPreferencesManager.userId
            
            val intent = if (userId != -1L) {
                Intent(this, DashboardActivity::class.java)
            } else {
                Intent(this, LoginActivity::class.java)
            }
            
            startActivity(intent)
            
            // Call finish() so if they hit the "Back" button, it closes the app 
            // instead of taking them back to the splash screen
            finish()
            
        }, 2000)
    }
}