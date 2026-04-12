package com.example.orderflowmobile

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.orderflowmobile.adapters.FoodAdapter
import com.example.orderflowmobile.api.ApiClient
import com.example.orderflowmobile.models.FoodItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DashboardActivity : AppCompatActivity() {

    private lateinit var rvFoodItems: RecyclerView
    private lateinit var foodAdapter: FoodAdapter
    private var allFoodItems: List<FoodItem> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        rvFoodItems = findViewById(R.id.rvFoodItems)
        val btnProfileToggle = findViewById<CardView>(R.id.btnProfileToggle)
        val cvDropdownMenu = findViewById<CardView>(R.id.cvDropdownMenu)
        val btnMenuLogout = findViewById<TextView>(R.id.btnMenuLogout)

        rvFoodItems.layoutManager = LinearLayoutManager(this)
        foodAdapter = FoodAdapter(emptyList())
        rvFoodItems.adapter = foodAdapter

        setupCategoryTabs()
        fetchFoodItems()

        // NEW: Toggle the dropdown menu visibility
        btnProfileToggle.setOnClickListener {
            if (cvDropdownMenu.visibility == View.GONE) {
                cvDropdownMenu.visibility = View.VISIBLE
            } else {
                cvDropdownMenu.visibility = View.GONE
            }
        }

        // NEW: The actual logout button inside the card
        btnMenuLogout.setOnClickListener {
            cvDropdownMenu.visibility = View.GONE // Hide it
            Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    private fun setupCategoryTabs() {
        val layoutCategories = findViewById<LinearLayout>(R.id.layoutCategories)
        layoutCategories.removeAllViews() // Clears old buttons if reloaded
        val categories = listOf("All", "Pizza", "Burgers", "Rice Meals", "Drinks", "Desserts")

        for (category in categories) {
            val btn = Button(this).apply {
                text = category
                isAllCaps = false

                // Initial styling (Only "All" is blue at first)
                if (category == "All") {
                    setBackgroundColor(Color.parseColor("#1A73E8"))
                    setTextColor(Color.WHITE)
                } else {
                    setBackgroundColor(Color.parseColor("#FFFFFF"))
                    setTextColor(Color.parseColor("#64748B"))
                }

                val params = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(0, 0, 16, 0)
                layoutParams = params

                // NEW: When clicked, update colors AND filter the menu
                setOnClickListener {
                    updateTabColors(layoutCategories, category)
                    filterMenu(category)
                }
            }
            layoutCategories.addView(btn)
        }
    }
    private fun updateTabColors(layoutCategories: LinearLayout, activeCategory: String) {
        for (i in 0 until layoutCategories.childCount) {
            val btn = layoutCategories.getChildAt(i) as? Button
            if (btn != null) {
                if (btn.text.toString() == activeCategory) {
                    // Highlight the clicked tab
                    btn.setBackgroundColor(Color.parseColor("#1A73E8"))
                    btn.setTextColor(Color.WHITE)
                } else {
                    // Reset all other tabs to white
                    btn.setBackgroundColor(Color.parseColor("#FFFFFF"))
                    btn.setTextColor(Color.parseColor("#64748B"))
                }
            }
        }
        }

    private fun filterMenu(category: String) {
        if (category == "All") {
            foodAdapter.updateData(allFoodItems)
        } else {
            val filtered = allFoodItems.filter { it.category == category }
            foodAdapter.updateData(filtered)
        }
    }

    private fun fetchFoodItems() {
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val token = "Bearer "
                val response = ApiClient.foodService.getFoodItems(token)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        allFoodItems = response.body()!!
                        foodAdapter.updateData(allFoodItems)
                    } else {
                        Toast.makeText(this@DashboardActivity, "Failed to load menu", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@DashboardActivity, "Error connecting to server", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}