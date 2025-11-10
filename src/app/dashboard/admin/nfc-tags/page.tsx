"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { NfcTag } from "@/lib/types";

export default function AdminNfcTagsPage() {
  const [tags, setTags] = useState<NfcTag[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/nfc-tags");
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">NFC Tag Inventory</h1>
        <Button onClick={() => alert("Generate tags coming soon!")}>
          Generate Tags
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tags.map((tag) => (
          <Card key={tag.id} className="space-y-2 p-6">
            <p className="text-sm font-semibold text-foreground">{tag.tag_id}</p>
            <p className="text-xs text-muted-foreground">
              Status: {tag.status} {tag.assigned_to_shop_id ? `→ ${tag.assigned_to_shop_id}` : ""}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

