<div id="message">

<header>
    <h1>Welcome aboard!</h1>
</header>

<main>
    <p>We are very happy that you decided to use {{ config('app.name') }}.</p>
    <p>All that is left for you is to activate you account.</p>
    <p>Activation link: <a href="{{ $activation_link }}">{{ $activation_link }}</a></p>
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
