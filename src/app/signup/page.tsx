"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { shopApplicationSchema } from "@/lib/validators";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shopName: "",
    shopType: "barber",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    pointsPerVisit: 10,
    rewardDescription: "Free haircut",
  });

  const handleChange = (key: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const payload = shopApplicationSchema.parse({
        ...formData,
        pointsPerVisit: Number(formData.pointsPerVisit),
      });

      const res = await fetch("/api/applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      const { referenceCode } = await res.json();
      router.push(`/signup/success?ref=${referenceCode}`);
    } catch (err) {
      console.error(err);
      setError("Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
          <h1 className="text-3xl font-bold text-foreground">Start Your Trial</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Liverpool&apos;s best loyalty system.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {error ? (
              <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Shop Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Shop Name *
                  </label>
                  <Input
                    required
                    value={formData.shopName}
                    onChange={(event) =>
                      handleChange("shopName", event.target.value)
                    }
                    placeholder="Dave's Barbers"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Shop Type *
                  </label>
                  <Select
                    value={formData.shopType}
                    onChange={(event) =>
                      handleChange("shopType", event.target.value)
                    }
                  >
                    <option value="barber">Barber Shop</option>
                    <option value="salon">Hair Salon</option>
                    <option value="cafe">Cafe</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Postcode *
                  </label>
                  <Input
                    required
                    value={formData.postcode}
                    onChange={(event) =>
                      handleChange("postcode", event.target.value.toUpperCase())
                    }
                    placeholder="L9 4AB"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Address Line 1 *
                  </label>
                  <Input
                    required
                    value={formData.addressLine1}
                    onChange={(event) =>
                      handleChange("addressLine1", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Address Line 2
                  </label>
                  <Input
                    value={formData.addressLine2}
                    onChange={(event) =>
                      handleChange("addressLine2", event.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Your Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Owner Name *
                  </label>
                  <Input
                    required
                    value={formData.ownerName}
                    onChange={(event) =>
                      handleChange("ownerName", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Owner Email *
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(event) =>
                      handleChange("ownerEmail", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Owner Phone *
                  </label>
                  <Input
                    required
                    value={formData.ownerPhone}
                    onChange={(event) =>
                      handleChange("ownerPhone", event.target.value)
                    }
                    placeholder="07XXX XXX XXX"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Loyalty Settings
              </h2>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Points per visit
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[8, 10, 12].map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium"
                      >
                        <input
                          type="radio"
                          name="points"
                          value={value}
                          checked={formData.pointsPerVisit === value}
                          onChange={() => handleChange("pointsPerVisit", value)}
                        />
                        {value} visits
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Reward Description
                  </label>
                  <Textarea
                    rows={3}
                    value={formData.rewardDescription}
                    onChange={(event) =>
                      handleChange("rewardDescription", event.target.value)
                    }
                    placeholder="Free haircut"
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              <input type="checkbox" required />
              <span>I agree to the Terms & Privacy Policy</span>
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

