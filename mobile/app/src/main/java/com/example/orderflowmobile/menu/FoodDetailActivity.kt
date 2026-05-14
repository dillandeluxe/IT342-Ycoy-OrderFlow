package com.example.orderflowmobile.menu

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.bumptech.glide.Glide
import com.example.orderflowmobile.R

class FoodDetailActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_food_detail)

        // Receive data from the Adapter
        val name = intent.getStringExtra("NAME") ?: "Unknown"
        val price = intent.getDoubleExtra("PRICE", 0.0)
        val desc = intent.getStringExtra("DESC") ?: "No description available."
        val seller = intent.getStringExtra("SELLER") ?: "RESTAURANT"
        val imageUrl = intent.getStringExtra("IMAGE_URL")

        // Find UI elements
        val tvName = findViewById<TextView>(R.id.detailName)
        val tvPrice = findViewById<TextView>(R.id.detailPrice)
        val tvDesc = findViewById<TextView>(R.id.detailDesc)
        val tvSeller = findViewById<TextView>(R.id.detailSeller)
        val ivImage = findViewById<ImageView>(R.id.ivDetailImage)
        val btnBack = findViewById<CardView>(R.id.btnBack)
        val btnAddCart = findViewById<Button>(R.id.detailAddToCart)

        // Populate Data
        tvName.text = name
        tvPrice.text = String.format("₱%.2f", price)
        tvDesc.text = desc
        tvSeller.text = seller.uppercase()

        if (!imageUrl.isNullOrBlank()) {
            Glide.with(this)
                .load(imageUrl)
                .centerCrop()
                .placeholder(R.drawable.ic_launcher_background)
                .into(ivImage)
        } else {
            ivImage.setImageResource(R.drawable.ic_launcher_background)
        }

        // Back Button functionality
        btnBack.setOnClickListener {
            finish() // Closes this screen and goes back to Dashboard!
        }

        // Add to Cart functionality
        btnAddCart.setOnClickListener {
            Toast.makeText(this, "$name added to cart (Phase 5)", Toast.LENGTH_SHORT).show()
        }
    }
}