package expo.modules.handleittelecom

import android.app.role.RoleManager
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.telecom.TelecomManager
import android.telephony.SubscriptionManager
import android.telephony.TelephonyManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class HandleItTelecomModule : Module() {
    private val ctx: Context get() = appContext.reactContext!!

    override fun definition() = ModuleDefinition {
        Name("HandleItTelecom")

        Events("onCallChanged")

        OnCreate {
            TelecomStore.listener = { number, state ->
                sendEvent("onCallChanged", mapOf("number" to number, "state" to state))
            }
        }

        OnDestroy {
            TelecomStore.listener = null
        }

        Function("isDefaultDialer") {
            ctx.getSystemService(TelecomManager::class.java).defaultDialerPackage == ctx.packageName
        }

        Function("requestDialerRole") {
            val activity = appContext.currentActivity ?: return@Function false
            val rm = activity.getSystemService(RoleManager::class.java)
            activity.startActivityForResult(rm.createRequestRoleIntent(RoleManager.ROLE_DIALER), 4242)
            true
        }

        Function("getSims") {
            val sm = ctx.getSystemService(SubscriptionManager::class.java)
            val list = sm.activeSubscriptionInfoList ?: emptyList()
            list.map {
                mapOf(
                    "subscriptionId" to it.subscriptionId,
                    "slot" to it.simSlotIndex + 1,
                    "carrier" to it.carrierName.toString(),
                    "number" to (it.number ?: "")
                )
            }
        }

        Function("setHandlingEnabled") { enabled: Boolean ->
            ctx.getSharedPreferences("handleit", Context.MODE_PRIVATE)
                .edit().putBoolean("enabled", enabled).apply()
        }

        Function("placeCall") { number: String, subscriptionId: Int ->
            val tm = ctx.getSystemService(TelecomManager::class.java)
            val extras = Bundle()
            val handle = tm.callCapablePhoneAccounts.firstOrNull {
                tm.getPhoneAccount(it)?.extras?.getInt("android.telecom.extra.SUBSCRIPTION_ID", -1) == subscriptionId
            } ?: tm.callCapablePhoneAccounts.getOrNull(0)
            handle?.let { extras.putParcelable(TelecomManager.EXTRA_PHONE_ACCOUNT_HANDLE, it) }
            tm.placeCall(Uri.fromParts("tel", number, null), extras)
        }

        Function("answer") {
            TelecomStore.calls.firstOrNull()?.answer(0)
        }

        Function("hangup") {
            TelecomStore.calls.firstOrNull()?.disconnect()
        }

        AsyncFunction("sendUssd") { code: String, subscriptionId: Int, promise: Promise ->
            val tm = ctx.getSystemService(TelephonyManager::class.java)
                .createForSubscriptionId(subscriptionId)
            tm.sendUssdRequest(code, object : TelephonyManager.UssdResponseCallback() {
                override fun onReceiveUssdResponse(t: TelephonyManager, request: String, response: CharSequence) {
                    promise.resolve(response.toString())
                }
                override fun onReceiveUssdResponseFailed(t: TelephonyManager, request: String, failureCode: Int) {
                    promise.reject("USSD_FAILED", "code $failureCode", null)
                }
            }, Handler(Looper.getMainLooper()))
        }
    }
}
