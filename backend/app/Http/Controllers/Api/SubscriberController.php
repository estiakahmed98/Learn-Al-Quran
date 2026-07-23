<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SubscriberRequest;
use App\Http\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SubscriberController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return NewsletterSubscriberResource::collection(NewsletterSubscriber::latest()->get());
    }

    public function subscribe(SubscriberRequest $request): JsonResponse
    {
        $email = strtolower(trim($request->validated('email')));
        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $email],
            ['status' => 'subscribed', 'unsubscribed_at' => null],
        );
        return response()->json([
            'message' => 'Successfully subscribed to the newsletter.',
            'subscriber' => new NewsletterSubscriberResource($subscriber),
        ]);
    }

    public function unsubscribe(SubscriberRequest $request): JsonResponse
    {
        $subscriber = NewsletterSubscriber::where('email', strtolower(trim($request->validated('email'))))->first();
        if (! $subscriber) return response()->json(['error' => 'Email not found in subscription list.'], 404);
        $subscriber->update(['status' => 'unsubscribed', 'unsubscribed_at' => now()]);
        return response()->json(['message' => 'Successfully unsubscribed.', 'subscriber' => new NewsletterSubscriberResource($subscriber)]);
    }

    public function unsubscribeLink(Request $request): Response
    {
        $email = strtolower(trim((string) $request->query('email')));
        $subscriber = $email ? NewsletterSubscriber::where('email', $email)->first() : null;
        if (! $subscriber) return response('<h2>Email not found in subscription list.</h2>', 404)->header('Content-Type', 'text/html; charset=utf-8');
        $subscriber->update(['status' => 'unsubscribed', 'unsubscribed_at' => now()]);
        return response('<h2>You have successfully unsubscribed.</h2>')->header('Content-Type', 'text/html; charset=utf-8');
    }

    public function destroy(SubscriberRequest $request): JsonResponse
    {
        $deleted = NewsletterSubscriber::where('email', strtolower(trim($request->string('email')->toString())))->delete();
        return $deleted
            ? response()->json(['message' => 'Subscriber deleted successfully.'])
            : response()->json(['error' => 'Subscriber not found.'], 404);
    }
}
