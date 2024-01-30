import { allPages } from "contentlayer/generated";

export const allPagesSorted = allPages.slice(0).sort((a, b) => a.chapter - b.chapter)
