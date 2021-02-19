<div id="message">

<header>
    <h1>New password!</h1>
</header>

<main>
    <p>You asked we delivered.</p>
    <p>Your new password is:</p>
    <p>{{ $new_password }}</p>
</main>

<footer>
    <p><strong>Thank you, {{ config('app.name') }}</strong></p>
</footer>

</div>

<style>
    #message{
        margin-left: 10px;
    }
</style>
