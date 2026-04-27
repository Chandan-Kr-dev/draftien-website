"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrencyINR } from "@/lib/format";
import { getWishlist, removeWishlist } from "@/lib/lms-api";
import type { WishlistItem } from "@/lib/types";

export default function StudentWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWishlist();
      setItems(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load wishlist."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = async (courseId: string) => {
    setRemovingId(courseId);
    setError(null);

    try {
      await removeWishlist(courseId);
      setItems((current) =>
        current.filter((item) => item.course.id !== courseId),
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not remove item."));
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading wishlist...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Saved courses</Badge>
          <CardTitle>Wishlist</CardTitle>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Wishlist is empty. Explore{" "}
            <Link href="/courses" className="text-primary hover:underline">
              courses
            </Link>{" "}
            and save the ones you like.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                <div>
                  <p className="font-medium text-foreground">
                    {item.course.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.course.teacherName ?? "Draftien Faculty"}
                  </p>
                  <p className="text-sm text-foreground">
                    {formatCurrencyINR(item.course.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/courses/${item.course.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Open
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(item.course.id)}
                    disabled={removingId === item.course.id}
                  >
                    {removingId === item.course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
