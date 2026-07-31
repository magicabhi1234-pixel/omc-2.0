// =============================================
// Shared GROQ projections
// =============================================

const IMAGE_PROJECTION = `{ "src": asset->url, "alt": coalesce(alt, "") }`;

const UNIVERSITY_PROJECTION = `{
  "id": slug.current,
  "slug": slug.current,
  name,
  "logo": logo${IMAGE_PROJECTION}.src,
  rating,
  reviewCount,
  studyMode,
  duration,
  eligibility,
  "approvals": approvals[]{ "id": lower(@), "label": @ },
  rankings[]{ source, value },
  startingFee,
  emi,
  placementSupport,
  brochureUrl,
  websiteUrl,
  featured
}`;

const TESTIMONIAL_PROJECTION = `{
  "id": _id,
  name,
  designation,
  university,
  "image": image${IMAGE_PROJECTION}.src,
  review,
  rating
}`;

const SEO_PROJECTION = `{
  "title": coalesce(metaTitle, ^.title, ^.h1),
  "description": coalesce(metaDescription, ^.excerpt),
  keywords,
  "canonical": canonicalUrl,
  "ogImage": ogImage${IMAGE_PROJECTION}.src,
  "robots": select(noIndex == true => "noindex", "index,follow")
}`;

const FAQ_PROJECTION = `{ question, answer }`;

// =============================================
// Landing Pages
// =============================================

export const LANDING_PAGE_SLUGS_QUERY = `*[_type == "landingPage" && defined(slug.current)].slug.current`;

export const LANDING_PAGE_HUB_QUERY = `*[_type == "landingPage" && defined(slug.current)] | order(title asc) {
  "slug": slug.current,
  category,
  "seoTitle": seo.metaTitle,
  "seoDescription": seo.metaDescription
}`;

export const LANDING_PAGE_BY_SLUG_QUERY = `*[_type == "landingPage" && slug.current == $slug][0]{
  "slug": slug.current,
  category,
  seo ${SEO_PROJECTION},
  hero {
    badge,
    heading,
    description,
    "heroImage": image${IMAGE_PROJECTION},
    "primaryButton": { "label": coalesce(primaryButtonText, "Apply Now"), "variant": "primary" },
    "secondaryButton": select(defined(secondaryButtonText) => { "label": secondaryButtonText, "variant": "outline" }, null),
    "stats": [
      select(defined(stat1Value) => { "value": stat1Value, "label": stat1Label }, null),
      select(defined(stat2Value) => { "value": stat2Value, "label": stat2Label }, null),
      select(defined(stat3Value) => { "value": stat3Value, "label": stat3Label }, null)
    ][defined(@)]
  },
  universitySection {
    badge,
    heading,
    description
  },
  "universities": universities[]->${UNIVERSITY_PROJECTION},
  compareSection {
    badge,
    heading,
    description,
    "features": features[]{ "id": lower(key), label, key }
  },
  whyChoose {
    heading,
    description,
    "items": items[]{ title, description, icon }
  },
  stats {
    heading,
    description,
    "stats": stats[]{ value, label }
  },
  specializations {
    heading,
    description,
    "items": items[]{ title, "slug": slug.current, description, icon }
  },
  scholarshipBanner {
    heading,
    description,
    "button": { "label": coalesce(buttonLabel, "Apply For Scholarship"), "variant": "primary" }
  },
  faq {
    heading,
    description,
    "faqs": faqs[]${FAQ_PROJECTION}
  },
  testimonialsHeading,
  "testimonials": testimonials[]->${TESTIMONIAL_PROJECTION},
  cta {
    badge,
    heading,
    description,
    "primaryButton": { "label": coalesce(primaryButtonText, "Apply Now"), "variant": "primary" },
    "secondaryButton": select(defined(secondaryButtonText) => { "label": secondaryButtonText, "variant": "outline" }, null)
  }
}`;

// =============================================
// Universities (standalone, e.g. default fallback list)
// =============================================

export const UNIVERSITIES_BY_SLUGS_QUERY = `*[_type == "university" && slug.current in $slugs]${UNIVERSITY_PROJECTION}`;

export const FEATURED_UNIVERSITIES_QUERY = `*[_type == "university" && featured == true] | order(name asc) ${UNIVERSITY_PROJECTION}`;

// =============================================
// Testimonials
// =============================================

export const DEFAULT_TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt asc) ${TESTIMONIAL_PROJECTION}`;

// =============================================
// Blog Posts
// =============================================

export const BLOG_SLUGS_QUERY = `*[_type == "blogPost" && defined(slug.current)].slug.current`;

const BLOG_POST_CARD_PROJECTION = `{
  "slug": slug.current,
  title,
  "h1": coalesce(h1, title),
  "featuredImage": featuredImage${IMAGE_PROJECTION},
  author,
  "publishedDate": publishedDate,
  category,
  excerpt,
  "readingTime": round(length(pt::text(content)) / 5 / 200) + " min"
}`;

export const BLOG_POSTS_BY_DATE_QUERY = `*[_type == "blogPost" && defined(slug.current)] | order(publishedDate desc) ${BLOG_POST_CARD_PROJECTION}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  "h1": coalesce(h1, title),
  seo ${SEO_PROJECTION},
  "featuredImage": featuredImage${IMAGE_PROJECTION},
  author,
  "publishedDate": publishedDate,
  "lastModifiedDate": _updatedAt,
  category,
  tags,
  excerpt,
  content,
  "readingTime": round(length(pt::text(content)) / 5 / 200) + " min",
  "wordCount": round(length(pt::text(content)) / 5),
  "faqs": faqs[]${FAQ_PROJECTION},
  "relatedPosts": relatedPosts[]->${BLOG_POST_CARD_PROJECTION}
}`;
