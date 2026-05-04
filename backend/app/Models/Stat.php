<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stat extends Model
{
    use HasUuids;

    protected $table = 'stat';
    protected $fillable = ['stat_id', 'user_id', 'id_stat_name', 'value', 'unit', 'type'];
    protected $primaryKey = 'stat_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function statName(): BelongsTo
    {
        return $this->belongsTo(StatName::class, 'id_stat_name', 'id_stat_name');
    }
}