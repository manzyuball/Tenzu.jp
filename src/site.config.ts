import { weekdayLabel } from "./lib/dates";

export const CURRENT_WORLD_DATE = "2005-12-04";
export const SITE_NAME = "天通.jp";
export const COPYRIGHT = "© 2005 天通";

export const BUILD_MODE =
  import.meta.env.TENZU_BUILD_MODE === "production" ? "production" : "development";

export const WORLD_DATE_LABEL = `2005年12月4日（${weekdayLabel(CURRENT_WORLD_DATE)}）`;
