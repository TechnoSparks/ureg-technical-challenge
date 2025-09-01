<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = ['currency_id', 'effective_date', 'rate'];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
