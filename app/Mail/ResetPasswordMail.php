<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private string $new_password;
    /**
     * Create a new message instance.
     *
     * @param string $new_password
     */
    public function __construct(string $new_password) {
        $this->new_password = $new_password;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): Mailable {
        return $this->subject('['.config('app.name').'] Password reset')
            ->markdown('emails.resetpassword', [
               'new_password' => $this->new_password
            ]);
    }
}
