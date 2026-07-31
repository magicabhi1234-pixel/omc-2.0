import type { StructureResolver } from "sanity/structure";
import { Icon } from "@sanity/icons";

const DocumentsIcon = () => <Icon symbol="documents" />;
const UsersIcon = () => <Icon symbol="users" />;
const BookIcon = () => <Icon symbol="book" />;
const CommentIcon = () => <Icon symbol="comment" />;

const LANDING_PAGE_CATEGORIES = [
  "Online MBA",
  "Distance MBA",
  "MBA Specializations",
  "Executive MBA",
  "University Pages",
  "Bachelor Programs",
];

const MANAGED_TYPES = ["landingPage", "university", "blogPost", "testimonial"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Landing Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Landing Pages")
            .items([
              ...LANDING_PAGE_CATEGORIES.map((category) =>
                S.listItem()
                  .title(category)
                  .child(
                    S.documentList()
                      .title(category)
                      .filter('_type == "landingPage" && category == $category')
                      .params({ category })
                      .defaultOrdering([{ field: "title", direction: "asc" }])
                  )
              ),
              S.divider(),
              S.listItem()
                .title("All Landing Pages")
                .child(
                  S.documentTypeList("landingPage")
                    .title("All Landing Pages")
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                ),
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
