package com.example.orderflowmobile.menu

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.ImageView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.orderflowmobile.R
import com.example.orderflowmobile.core.ApiClient
import com.example.orderflowmobile.core.SharedPreferencesManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class FoodAdapter(
    private var foodList: List<FoodItem>,
    private val onAddToCart: (FoodItem) -> Unit
) : RecyclerView.Adapter<FoodAdapter.FoodViewHolder>() {

    class FoodViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val ivFoodImage: ImageView = itemView.findViewById(R.id.ivFoodImage)
        val tvSellerName: TextView = itemView.findViewById(R.id.tvSellerName)
        val tvFoodName: TextView = itemView.findViewById(R.id.tvFoodName)
        val tvFoodPrice: TextView = itemView.findViewById(R.id.tvFoodPrice)
        val tvFoodDesc: TextView = itemView.findViewById(R.id.tvFoodDesc)
        val btnViewFood: Button = itemView.findViewById(R.id.btnViewFood)
        val btnAddToCart: Button = itemView.findViewById(R.id.btnAddToCart)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_food, parent, false)
        return FoodViewHolder(view)
    }

    override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
        val item = foodList[position]
        val context = holder.itemView.context
        val restaurantName = item.seller?.restaurantName ?: item.seller?.fullName ?: "SELLER"

        holder.tvSellerName.text = restaurantName.uppercase()
        holder.tvFoodName.text = item.name
        holder.tvFoodPrice.text = String.format("₱%.2f", item.price)
        holder.tvFoodDesc.text = item.description

        if (!item.imageUrl.isNullOrBlank()) {
            Glide.with(context)
                .load(item.imageUrl)
                .centerCrop()
                .placeholder(R.drawable.ic_launcher_background)
                .into(holder.ivFoodImage)
        } else {
            holder.ivFoodImage.setImageResource(R.drawable.ic_launcher_background)
        }

        if (item.stock <= 0) { holder.btnAddToCart.isEnabled = false; holder.btnAddToCart.text = "Sold Out" } else { holder.btnAddToCart.isEnabled = true; holder.btnAddToCart.text = "Add to Cart" }

        holder.btnViewFood.setOnClickListener {
            val intent = Intent(context, FoodDetailActivity::class.java).apply {
                putExtra("NAME", item.name)
                putExtra("PRICE", item.price)
                putExtra("DESC", item.description)
                putExtra("SELLER", restaurantName)
                putExtra("IMAGE_URL", item.imageUrl)
                putExtra("STOCK", item.stock)
            }
            context.startActivity(intent)
        }

        holder.btnAddToCart.setOnClickListener {
            // Use the provided callback to handle adding to cart
            onAddToCart(item)
        }
    }

    override fun getItemCount(): Int = foodList.size

    fun updateData(newList: List<FoodItem>) {
        foodList = newList
        notifyDataSetChanged()
    }
}

