<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\NewsletterRequest;
use App\Http\Resources\NewsletterResource;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class NewsletterController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return NewsletterResource::collection(Newsletter::latest()->get());
    }

    public function store(NewsletterRequest $request): NewsletterResource
    {
        return new NewsletterResource(Newsletter::create([
            ...$request->validated(),
            'content' => $this->sanitizeHtml($request->validated('content')),
        ]));
    }

    public function show(Newsletter $newsletter): NewsletterResource
    {
        return new NewsletterResource($newsletter);
    }

    public function update(NewsletterRequest $request, Newsletter $newsletter): NewsletterResource
    {
        $this->ensureDraft($newsletter);
        $newsletter->update([
            ...$request->validated(),
            'content' => $this->sanitizeHtml($request->validated('content')),
        ]);
        return new NewsletterResource($newsletter->refresh());
    }

    public function destroy(Newsletter $newsletter): JsonResponse
    {
        $this->ensureDraft($newsletter);
        $newsletter->delete();
        return response()->json(['message' => 'Newsletter deleted successfully.']);
    }

    public function send(Newsletter $newsletter): JsonResponse
    {
        $this->ensureDraft($newsletter);
        $subscribers = NewsletterSubscriber::where('status', 'subscribed')->pluck('email');
        if ($subscribers->isEmpty()) {
            return response()->json(['error' => 'No subscribers found.'], 404);
        }

        $sent = 0;
        $errors = [];
        foreach ($subscribers as $email) {
            try {
                Mail::html($this->emailHtml($newsletter, $email), function (Message $message) use ($newsletter, $email): void {
                    $message->to($email)->subject($newsletter->subject);
                });
                $sent++;
            } catch (Throwable $exception) {
                report($exception);
                $errors[] = ['email' => $email, 'error' => $exception->getMessage()];
            }
        }

        if ($sent > 0) {
            $newsletter->update(['status' => 'sent', 'sent_at' => now()]);
        }

        return response()->json([
            'success' => count($errors) === 0,
            'total' => $subscribers->count(),
            'sent' => $sent,
            'failed' => count($errors),
            'errors' => $errors,
        ]);
    }

    private function ensureDraft(Newsletter $newsletter): void
    {
        if ($newsletter->status === 'sent') {
            throw ValidationException::withMessages(['newsletter' => 'A sent newsletter cannot be changed or sent again.']);
        }
    }

    private function sanitizeHtml(string $html): string
    {
        $html = strip_tags($html, '<p><br><strong><b><em><i><u><ul><ol><li><a><h1><h2><h3><blockquote>');
        $html = preg_replace('/\s+on\w+\s*=\s*(["\']).*?\1/iu', '', $html) ?? '';
        return preg_replace('/javascript\s*:/iu', '', $html) ?? '';
    }

    private function emailHtml(Newsletter $newsletter, string $email): string
    {
        $unsubscribe = url('/api/v1/newsletter/unsubscribe').'?email='.urlencode($email);
        return '<div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">'
            .'<h1>'.e($newsletter->title).'</h1><div>'.$newsletter->content.'</div>'
            .'<p><a href="'.e($unsubscribe).'">Unsubscribe</a></p></div>';
    }
}
