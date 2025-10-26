<?php

return [
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'isProduction' => env('MIDTRANS_IS_PRODUCTION', false),
    'serverKey' => env('MIDTRANS_SERVER_KEY'),
    'clientKey' => env('MIDTRANS_CLIENT_KEY'),
    'isSanitized' => env('MIDTRANS_SANITIZE', true),
    'is3ds' => env('MIDTRANS_3DS', true),
];
