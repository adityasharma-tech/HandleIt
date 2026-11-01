package expo.modules.handleittelecom

import android.content.Context
import android.content.Intent
import android.telecom.Call
import android.telecom.CallScreeningService
import android.telecom.InCallService

class HandleItScreeningService : CallScreeningService() {
    override fun onScreenCall(details: Call.Details) {
        val builder = CallResponse.Builder()
        if (details.callDirection == Call.Details.DIRECTION_INCOMING) {
            val enabled = getSharedPreferences("handleit", Context.MODE_PRIVATE)
                .getBoolean("enabled", false)
            val number = details.handle?.schemeSpecificPart ?: ""
            if (enabled && !TelecomStore.isKnown(this, number)) {
                builder.setDisallowCall(true).setRejectCall(true).setSkipNotification(true)
            }
        }
        respondToCall(details, builder.build())
    }
}

class HandleItInCallService : InCallService() {
    private val callback = object : Call.Callback() {
        override fun onStateChanged(call: Call, state: Int) {
            TelecomStore.notify(call, state)
        }
    }

    override fun onCallAdded(call: Call) {
        TelecomStore.calls.add(call)
        call.registerCallback(callback)
        TelecomStore.notify(call)
        packageManager.getLaunchIntentForPackage(packageName)?.let {
            it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            startActivity(it)
        }
    }

    override fun onCallRemoved(call: Call) {
        call.unregisterCallback(callback)
        TelecomStore.calls.remove(call)
        TelecomStore.notify(call, Call.STATE_DISCONNECTED)
    }
}
