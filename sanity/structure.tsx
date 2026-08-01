import type { StructureResolver } from "sanity/structure";
import { Icon } from "@sanity/icons";

const DocumentsIcon = () => <Icon symbol="documents" />;
const UsersIcon = () => <Icon symbol="users" />;
const BookIcon = () => <Icon symbol="book" />;
const CommentIcon = () => <Icon symbol="comment" />;

const MANAGED_TYPES = ["landingPage", "university", "blogPost", "testimonial"];

// Kept as a single flat list (not nested per-category panes) so Studio's
// Content / Landing Pages navigation panes stay visible alongside the
// document editor - each extra pane level pushes earlier panes further off
// screen. Category is still visible per-row via the preview subtitle
// (see landingPage.ts), and editors can re-order by it from the list menu.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Landing Pages")
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList("landingPage")
            .title("Landing Pages")
            .defaultOrdering([{ field: "title", direction: "asc" }])
            .menuItems([
              S.orderingMenuItem({
                name: "titleAsc",
                title: "By Title",
                by: [{ field: "title", direction: "asc" }],
              }),
              S.orderingMenuItem({
                name: "categoryAsc",
                title: "By Category",
                by: [
                  { field: "category", direction: "asc" },
                  { field: "title", direction: "asc" },
                ],
              }),
              ...(S.documentTypeList("landingPage").getMenuItems() ?? []),
            ])
        ),

      S.listItem()
        .title("Universities")
        .icon(UsersIcon)
        .child(
          S.documentTypeList("university")
            .title("Universities")
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),

      S.listItem()
        .title("Blog Posts")
        .icon(BookIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Blog Posts")
            .defaultOrdering([{ field: "publishedDate", direction: "desc" }])
        ),

      S.listItem()
        .title("Testimonials")
        .icon(CommentIcon)
        .child(S.documentTypeList("testimonial").title("Testimonials")),

      S.divider(),

      // Any future schema type shows up here automatically, without needing
      // this file updated - only the four content types above get curated
      // groupings/orderings.
      ...S.documentTypeListItems().filter(
        (item) => !MANAGED_TYPES.includes(item.getId() ?? "")
      ),
    ]);
