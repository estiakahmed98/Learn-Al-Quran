<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\NoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class NoteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Note::with('course')->latest();
        if ($request->filled('course_id')) $query->where('course_id', $request->string('course_id')->toString());
        return NoteResource::collection($query->get());
    }
    public function store(NoteRequest $request): NoteResource { return new NoteResource(Note::create($request->validated())); }
    public function show(Note $note): NoteResource { return new NoteResource($note); }
    public function update(NoteRequest $request, Note $note): NoteResource { $note->update($request->validated()); return new NoteResource($note->refresh()); }
    public function destroy(Note $note): Response { $note->delete(); return response()->noContent(); }
}
