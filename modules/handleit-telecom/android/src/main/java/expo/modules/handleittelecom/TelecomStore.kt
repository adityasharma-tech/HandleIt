package expo.modules.handleittelecom

import android.content.Context
import android.net.Uri
import android.provider.ContactsContract
import android.telecom.Call

object TelecomStore {
    val calls = mutableListOf<Call>()
    var listener: ((String, Int) -> Unit)? = null

    fun notify(call: Call, state: Int = call.state) {
        val number = call.details?.handle?.schemeSpecificPart ?: ""
        listener?.invoke(number, state)
    }

    fun isKnown(ctx: Context, number: String): Boolean {
        if (number.isEmpty()) return false
        return try {
            val uri = Uri.withAppendedPath(
                ContactsContract.PhoneLookup.CONTENT_FILTER_URI,
                Uri.encode(number)
            )
            ctx.contentResolver.query(
                uri,
                arrayOf(ContactsContract.PhoneLookup._ID),
                null, null, null
            )?.use { it.moveToFirst() } ?: false
        } catch (e: SecurityException) {
            true
        }
    }
}
