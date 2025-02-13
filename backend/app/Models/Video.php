<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $table = 'videos'; 

    protected $fillable = [
        'title',
        'description',
        'youtube_url',
        'instructor_name',
        'category',
        'transcript',
        'created_at',
        'updated_at'
    ];

    public $timestamps = false; 
}
 
