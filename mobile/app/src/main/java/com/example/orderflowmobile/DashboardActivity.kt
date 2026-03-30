package com.example.orderflowmobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class DashboardActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val tvWelcome = findViewById<TextView>(R.id.tvWelcomeUser)
        val btnLogout = findViewById<Button>(R.id.btnLogout)

        // Grab the email that we will pass from the Login Screen
        val userEmail = intent.getStringExtra("USER_EMAIL") ?: "Trader"
        tvWelcome.text = "Welcome back,\n$userEmail!"

        // Logout Button Logic
        btnLogout.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            // This clears the backstack so they can't press "Back" to bypass the login screen
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }
}