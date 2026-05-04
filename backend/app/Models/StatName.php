<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class StatName extends Model
{
    use HasUuids;
    protected $table = 'stat_name';
    protected $primaryKey = 'id_stat_name';
    protected $fillable = ['name'];

    public function stats() {
        return $this->hasMany(Stat::class, 'id_stat_name');
    }

    public function targets() {
        return $this->hasMany(Target::class, 'id_stat_name');
    }
}