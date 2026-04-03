"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/actions/review.actions";
import { toast } from "sonner";

interface ReviewFormProps {
  listingId: string;
}

export function ReviewForm({ listingId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(listingId, { rating, title, comment });
      toast.success("Review submitted!");
      setRating(0);
      setTitle("");
      setComment("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mt-4">
      <h3 className="text-sm font-medium">Write a Review</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="p-0.5"
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {rating > 0 ? `${rating}/5` : "Select rating"}
        </span>
      </div>
      <Input
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <Button type="submit" size="sm" disabled={submitting || rating === 0}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
