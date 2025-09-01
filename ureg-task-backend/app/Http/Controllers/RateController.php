<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Currency;

class RateController extends Controller
{
    // GET /api/rates/latest
    // Return the rates on the client's current date
    public function latest(Request $request)
    {
        $latestDate = \App\Models\ExchangeRate::max('effective_date'); // latest rate means getting the most recent DATE in the database

        return $this->byDate($latestDate, $request);
    }

    // GET /api/rates/{date}
    // Return the rates on the requested date
    // Query params allow to set limit per page
    public function byDate($date, Request $request)
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 12);
        // Validate page parameter
        if (!is_numeric($page) || $page < 1) {
            return response()->json([
                'error' => 'Page must be a positive integer.'
            ], 400);
        }
        // Validate limit parameter
        if (!is_numeric($limit) || $limit < 1 || $limit > 100) {
            return response()->json([
                'error' => 'Limit must be a positive integer between 1 and 100.'
            ], 400);
        }
        $page = (int) $page;
        $limit = (int) $limit;
        $offset = ($page - 1) * $limit;

        // Validate date format: yyyymmdd

        $rates = Currency::with(['rates' => function ($q) use ($date) {
            $q->where('effective_date', $date);
        }])
        ->offset($offset)
        ->limit($limit)
        ->get();

        $totalCurrencies = Currency::count();

        return response()->json([
            'effective_date' => $date,
            'rates' => $rates->map(function ($currency) {
                return [
                    'currency' => $currency->code,
                    'rate' => $currency->rates->first()->rate ?? null,
                ];
            }),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $totalCurrencies,
                'has_more' => ($offset + $limit) < $totalCurrencies
            ]
        ]);
    }

    // GET /rates/availableDates
    // Return all the dates that have at least 1 rate in it
    public function giveListOfDates() {
        $dates = \App\Models\ExchangeRate::whereNotNull('rate')
            ->distinct()
            ->pluck('effective_date')
            ->map(function ($date) {
                return str_replace('-', '', $date);
            });

        return response()->json([
            'dates' => $dates,
        ]);
    }

    // POST /api/rates/{date}
    // boilerplate API endpoint should we are to implement upsert (update/insert) rate in future
    // WARN: currently this API endpoint is not exposed in /routes/api.php
    public function addRateOnDate(Request $request)
    {
        $date = $request->input('date');
        $currency = $request->input('currency');
        $value = $request->input('value');

        // Validate date format: yyyymmdd
        if (!preg_match('/^\d{8}$/', $date)) {
            return response()->json([
                'error' => 'Invalid date format. Use yyyymmdd.'
            ], 400);
        }

        // Validate value
        if (!is_numeric($value) || $value <= 0) {
            return response()->json([
                'error' => 'Value must be a positive number (integer or decimal).'
            ], 400);
        }

        // TODO: what do we do if currency not exists, should we add to DB, or say it dont exist?
        $currencyModel = Currency::where('code', $currency)->first();
        if (!$currencyModel) {
            return response()->json([
                'error' => 'Currency does not exist.'
            ], 404);
        }

        // Add or update rate
        $rate = \App\Models\ExchangeRate::updateOrCreate(
            [
                'currency_id' => $currencyModel->id,
                'effective_date' => $date,
            ],
            [
                'rate' => $value,
            ]
        );

        return response()->json([
            'message' => 'Rate added/updated successfully.',
            'data' => [
                'currency' => $currency,
                'effective_date' => $date,
                'rate' => $rate->rate,
            ]
        ]);
    }
}
