<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupExpiredVerifications extends Command
{
    protected $signature = 'verification:cleanup';
    protected $description = 'Clean up expired verification codes';

    public function handle()
    {
        DB::table('user_verifications')
            ->where('expires_at', '<', now())
            ->delete();
            
        $this->info('Expired verification codes cleaned up successfully.');
    }
} 