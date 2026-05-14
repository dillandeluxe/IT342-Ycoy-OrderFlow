package com.example.orderflowmobile.menu

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
import com.example.orderflowmobile.R
import com.example.orderflowmobile.auth.LoginActivity
import com.example.orderflowmobile.cart.CartActivity
import com.example.orderflowmobile.core.ApiClient
import com.example.orderflowmobile.core.SharedPreferencesManager
import com.example.orderflowmobile.core.SnackbarUtils
import com.example.orderflowmobile.transaction.OrderHistoryActivity
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
        

        rvFoodItems.layoutManager = LinearLayoutManager(this)
        foodAdapter = FoodAdapter(emptyList()) { foodItem -> addToCart(foodItem) }
        rvFoodItems.adapter = foodAdapter

        setupCategoryTabs()
        fetchFoodItems()

        // ── Bottom Nav ────────────────────────────────────────────────────────

        // Search — scrolls food list back to top & focuses list
        findViewById<LinearLayout>(R.id.navSearch).setOnClickListener {
            rvFoodItems.smoothScrollToPosition(0)
        }

        // Cart
        findViewById<LinearLayout>(R.id.navCart).setOnClickListener {
            startActivity(Intent(this, CartActivity::class.java))
        }

        // Orders — go to order history
        findViewById<LinearLayout>(R.id.navOrders).setOnClickListener {
            startActivity(Intent(this, OrderHistoryActivity::class.java))
        }

        // Profile
        val profileIntent = Intent(this, com.example.orderflowmobile.profile.ProfileActivity::class.java)
        findViewById<LinearLayout>(R.id.navProfile).setOnClickListener {
            startActivity(profileIntent)
        }

        // Header Profile Button
        btnProfileToggle.setOnClickListener {
            startActivity(profileIntent)
        }
    }

    private fun setupCategoryTabs() {
        val layoutCategories = findViewById<LinearLayout>(R.id.layoutCategories)
        layoutCategories.removeAllViews()
        val categories = listOf("All", "Pizza", "Burgers", "Rice Meals", "Drinks", "Desserts")

        for (category in categories) {
            val btn = Button(this).apply {
                text = category
                isAllCaps = false
                if (category == "All") {
                    setBackgroundColor(Color.parseColor("#E63946"))
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
                    btn.setBackgroundColor(Color.parseColor("#E63946"))
                    btn.setTextColor(Color.WHITE)
                } else {
                    btn.setBackgroundColor(Color.parseColor("#FFFFFF"))
                    btn.setTextColor(Color.parseColor("#64748B"))
                }
            }
        }
    }

    private fun filterMenu(category: String) {
        if (category == "All") foodAdapter.updateData(allFoodItems)
        else foodAdapter.updateData(allFoodItems.filter { it.category == category })
    }

    private fun fetchFoodItems() {
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = ApiClient.foodService.getFoodItems("Bearer ")
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

    private fun addToCart(foodItem: FoodItem) {
        val userId = SharedPreferencesManager.userId
        if (userId == -1L) {
            Toast.makeText(this, "Please log in first", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = ApiClient.cartService.addToCart(userId, foodItem.id)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        SnackbarUtils.showSuccess(
                            this@DashboardActivity,
                            "Added to Cart!",
                            "${foodItem.name} is in your cart"
                        )
                    } else {
                        SnackbarUtils.showError(
                            this@DashboardActivity,
                            "Could not add item",
                            "Server error ${response.code()}"
                        )
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    SnackbarUtils.showError(
                        this@DashboardActivity,
                        "Network Error",
                        e.message ?: "Could not connect to server"
                    )
                }
            }
        }
    }
}

