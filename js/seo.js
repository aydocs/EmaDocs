/**
 * @module SEO
 * @description Complete SEO utilities for meta tags, Open Graph, structured data, sitemaps
 */

window.Adiox = window.Adiox || {}

window.Adiox.SEO = {
  /**
   * Set page meta tags
   * @param {Object} meta - Meta information
   * @param {string} meta.title - Page title
   * @param {string} meta.description - Page description
   * @param {string} meta.keywords - Meta keywords
   * @param {string} meta.author - Page author
   * @param {string} meta.canonical - Canonical URL
   */
  setMeta(meta) {
    // Title
    if (meta.title) {
      document.title = meta.title
      this.setMetaTag("og:title", meta.title)
      this.setMetaTag("twitter:title", meta.title)
    }

    // Description
    if (meta.description) {
      this.setMetaTag("description", meta.description)
      this.setMetaTag("og:description", meta.description)
      this.setMetaTag("twitter:description", meta.description)
    }

    // Keywords
    if (meta.keywords) {
      this.setMetaTag("keywords", meta.keywords)
    }

    // Author
    if (meta.author) {
      this.setMetaTag("author", meta.author)
    }

    // Canonical
    if (meta.canonical) {
      this.setLinkTag("canonical", meta.canonical)
      this.setMetaTag("og:url", meta.canonical)
    }
  },

  /**
   * Set Open Graph meta tags
   * @param {Object} og - Open Graph data
   */
  setOpenGraph(og) {
    const defaults = {
      type: "website",
      locale: "en_US",
    }

    const data = { ...defaults, ...og }

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        this.setMetaTag(`og:${key}`, value)
      }
    })
  },

  /**
   * Set Twitter Card meta tags
   * @param {Object} twitter - Twitter card data
   */
  setTwitterCard(twitter) {
    const defaults = {
      card: "summary_large_image",
    }

    const data = { ...defaults, ...twitter }

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        this.setMetaTag(`twitter:${key}`, value)
      }
    })
  },

  /**
   * Add structured data (JSON-LD)
   * @param {Object} data - Structured data object
   */
  addStructuredData(data) {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  },

  /**
   * Generate breadcrumb structured data
   * @param {Array} items - Breadcrumb items [{name, url}]
   */
  addBreadcrumbStructuredData(items) {
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }

    this.addStructuredData(data)
  },

  /**
   * Generate article structured data
   * @param {Object} article - Article data
   */
  addArticleStructuredData(article) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: article.image,
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate,
      author: {
        "@type": "Person",
        name: article.author,
      },
    }

    this.addStructuredData(data)
  },

  /**
   * Generate organization structured data
   * @param {Object} org - Organization data
   */
  addOrganizationStructuredData(org) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: org.name,
      url: org.url,
      logo: org.logo,
      description: org.description,
      contactPoint: org.contactPoint
        ? {
            "@type": "ContactPoint",
            telephone: org.contactPoint.telephone,
            contactType: org.contactPoint.contactType,
          }
        : undefined,
      sameAs: org.socialLinks,
    }

    this.addStructuredData(data)
  },

  /**
   * Generate sitemap XML
   * @param {Array} urls - Array of URL objects [{loc, lastmod, changefreq, priority}]
   * @returns {string} Sitemap XML string
   */
  generateSitemap(urls) {
    const urlEntries = urls
      .map(
        (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
      )
      .join("")

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
  },

  /**
   * Generate robots.txt content
   * @param {Object} config - Robots.txt configuration
   * @returns {string} Robots.txt content
   */
  generateRobotsTxt(config) {
    const { userAgent = "*", allow = [], disallow = [], sitemap } = config

    let content = `User-agent: ${userAgent}\n`

    allow.forEach((path) => {
      content += `Allow: ${path}\n`
    })

    disallow.forEach((path) => {
      content += `Disallow: ${path}\n`
    })

    if (sitemap) {
      content += `\nSitemap: ${sitemap}\n`
    }

    return content
  },

  /**
   * Set meta tag helper
   * @private
   */
  setMetaTag(name, content) {
    const isProperty = name.startsWith("og:") || name.startsWith("twitter:")
    const attr = isProperty ? "property" : "name"

    let tag = document.querySelector(`meta[${attr}="${name}"]`)

    if (!tag) {
      tag = document.createElement("meta")
      tag.setAttribute(attr, name)
      document.head.appendChild(tag)
    }

    tag.setAttribute("content", content)
  },

  /**
   * Set link tag helper
   * @private
   */
  setLinkTag(rel, href) {
    let tag = document.querySelector(`link[rel="${rel}"]`)

    if (!tag) {
      tag = document.createElement("link")
      tag.setAttribute("rel", rel)
      document.head.appendChild(tag)
    }

    tag.setAttribute("href", href)
  },
}
