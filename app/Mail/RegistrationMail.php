<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    private string $activation_link;
    /**
     * Create a new message instance.
     *
     * @param string $activation_link
     */
    public function __construct(string $activation_link) {
        $this->activation_link = $activation_link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): Mailable {
        return $this->subject('['.config('app.name').'] Account activation')
            ->markdown('emails.register', [
                'activation_link' => $this->activation_link
            ]);
    }
}
