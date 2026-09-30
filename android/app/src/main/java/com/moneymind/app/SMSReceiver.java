package com.moneymind.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

public class SMSReceiver extends BroadcastReceiver {
    private static final String TAG = "MoneyMindSMS";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                String format = bundle.getString("format");
                if (pdus != null) {
                    for (Object pdu : pdus) {
                        SmsMessage sms;
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                            sms = SmsMessage.createFromPdu((byte[]) pdu, format);
                        } else {
                            sms = SmsMessage.createFromPdu((byte[]) pdu);
                        }

                        if (sms != null) {
                            String sender = sms.getDisplayOriginatingAddress();
                            String messageBody = sms.getMessageBody();
                            Log.d(TAG, "SMS Received from: " + sender + ", Body: " + messageBody);

                            if (MainActivity.instance != null) {
                                MainActivity.instance.notifySmsReceived(sender, messageBody);
                            }
                        }
                    }
                }
            }
        }
    }
}
