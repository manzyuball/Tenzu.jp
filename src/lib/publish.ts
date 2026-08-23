export type Publishable = {
  status: "dev-sample" | "approved";
  canon: "S" | "I" | "P" | "X";
};

export function isPublishable(data: Publishable, mode: "development" | "production"): boolean {
  if (data.canon === "P" || data.canon === "X") return false;
  if (mode === "production") {
    return data.status === "approved" && (data.canon === "S" || data.canon === "I");
  }
  return data.status === "approved" || data.status === "dev-sample";
}

export function fileSlug(id: string): string {
  const parts = id.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] ?? id;
}
