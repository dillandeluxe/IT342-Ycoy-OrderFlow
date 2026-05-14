package com.example.orderflowmobile.core

import android.app.Activity
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.view.animation.AnimationUtils
import com.google.android.material.snackbar.Snackbar

/**
 * Modern, beautiful in-app notification helper.
 * Replaces plain Toast messages with styled bottom cards.
 */
object SnackbarUtils {

    /** Green checkmark card — for successes like "Added to Cart" or "Order Placed" */
    fun showSuccess(activity: Activity, message: String, subMessage: String? = null) {
        showCustomSnackbar(
            activity = activity,
            message = message,
            subMessage = subMessage,
            bgColor = Color.parseColor("#1A1A2E"),
            accentColor = Color.parseColor("#22C55E"),
            emoji = "✓"
        )
    }

    /** Red/warning card — for errors */
    fun showError(activity: Activity, message: String, subMessage: String? = null) {
        showCustomSnackbar(
            activity = activity,
            message = message,
            subMessage = subMessage,
            bgColor = Color.parseColor("#1A1A2E"),
            accentColor = Color.parseColor("#EF4444"),
            emoji = "✕"
        )
    }

    private fun showCustomSnackbar(
        activity: Activity,
        message: String,
        subMessage: String?,
        bgColor: Int,
        accentColor: Int,
        emoji: String
    ) {
        val rootView = activity.window.decorView.findViewById<View>(android.R.id.content)

        // Build the snackbar with a custom view
        val snackbar = Snackbar.make(rootView, "", Snackbar.LENGTH_LONG)
        snackbar.duration = 3000

        // Get the snackbar layout and clear default background
        val snackbarLayout = snackbar.view as Snackbar.SnackbarLayout
        snackbarLayout.setBackgroundColor(Color.TRANSPARENT)
        snackbarLayout.setPadding(0, 0, 0, 0)

        // ── Outer container ───────────────────────────────────────────
        val container = LinearLayout(activity).apply {
            orientation = LinearLayout.HORIZONTAL
            setBackgroundColor(bgColor)
            setPadding(dpToPx(activity, 20), dpToPx(activity, 16),
                dpToPx(activity, 20), dpToPx(activity, 16))
            // Rounded corners via a programmatic drawable
            background = createRoundedBackground(bgColor, dpToPx(activity, 16).toFloat())
            elevation = dpToPx(activity, 8).toFloat()
            gravity = Gravity.CENTER_VERTICAL
        }

        // ── Accent icon pill ──────────────────────────────────────────
        val iconView = TextView(activity).apply {
            text = emoji
            textSize = 16f
            setTextColor(bgColor)
            typeface = Typeface.DEFAULT_BOLD
            background = createRoundedBackground(accentColor, dpToPx(activity, 20).toFloat())
            val s = dpToPx(activity, 36)
            layoutParams = LinearLayout.LayoutParams(s, s).apply {
                marginEnd = dpToPx(activity, 14)
            }
            gravity = Gravity.CENTER
        }

        // ── Text column ───────────────────────────────────────────────
        val textColumn = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }

        val titleView = TextView(activity).apply {
            text = message
            textSize = 15f
            setTextColor(Color.WHITE)
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
        }
        textColumn.addView(titleView)

        if (!subMessage.isNullOrBlank()) {
            val subView = TextView(activity).apply {
                text = subMessage
                textSize = 12f
                setTextColor(Color.parseColor("#94A3B8"))
                typeface = Typeface.DEFAULT
            }
            textColumn.addView(subView)
        }

        // ── Colored left accent bar ───────────────────────────────────
        val accentBar = View(activity).apply {
            layoutParams = LinearLayout.LayoutParams(dpToPx(activity, 3),
                LinearLayout.LayoutParams.MATCH_PARENT).apply { marginEnd = dpToPx(activity, 14) }
            background = createRoundedBackground(accentColor, dpToPx(activity, 2).toFloat())
        }

        container.addView(accentBar)
        container.addView(iconView)
        container.addView(textColumn)

        // Add container to snackbar with margin
        val params = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            leftMargin = dpToPx(activity, 16)
            rightMargin = dpToPx(activity, 16)
            bottomMargin = dpToPx(activity, 24)
        }
        snackbarLayout.addView(container, params)

        snackbar.show()
    }

    private fun dpToPx(activity: Activity, dp: Int): Int {
        return (dp * activity.resources.displayMetrics.density).toInt()
    }

    private fun createRoundedBackground(color: Int, radius: Float): android.graphics.drawable.GradientDrawable {
        return android.graphics.drawable.GradientDrawable().apply {
            shape = android.graphics.drawable.GradientDrawable.RECTANGLE
            setColor(color)
            cornerRadius = radius
        }
    }
}
