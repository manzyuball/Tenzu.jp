import { defineCollection, z } from "astro:content";
import { tenzuLoader } from "./lib/tenzu-loader";

const common = {
  title: z.string(),
  world_pub_date: z.coerce.date(),
  world_update_date: z.coerce.date(),
  canon: z.enum(["S", "I", "P", "X"]),
  provenance: z.string(),
  status: z.enum(["dev-sample", "approved"]),
  visibility: z.enum(["public", "restricted"]),
  notice: z.string().optional(),
  image: z.string().optional(),
  image_caption: z.string().optional(),
  sources: z.array(z.string()).optional(),
};

const dict = defineCollection({
  loader: tenzuLoader("dict"),
  schema: z.object({
    ...common,
    reading: z.string(),
    category: z.enum(["person", "org", "place", "event", "misc"]),
    density: z.enum(["long", "standard", "short", "stub"]),
    infobox: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    related: z.array(z.string()).optional(),
    history: z.array(z.object({ date: z.coerce.date(), note: z.string() })).optional(),
  }),
});

const news = defineCollection({
  loader: tenzuLoader("news"),
  schema: z.object({
    ...common,
    news_category: z.enum(["政治", "経済", "社会", "地域", "国際", "文化"]),
    dateline: z.string(),
    related_dict: z.array(z.string()).optional(),
  }),
});

const corp = defineCollection({
  loader: tenzuLoader("corp"),
  schema: z.object({
    ...common,
  }),
});

export const collections = { dict, news, corp };
