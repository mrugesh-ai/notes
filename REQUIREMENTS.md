# Developer Resource Library Website - Requirements

## 1. Project Overview

The goal of this project is to build a fast, static website that acts as a curated library of developer learning resources.

The site will not contain authored tutorials or courses. Instead, it will provide organized access to community-shared resources such as:

- Cheatsheets
- Interview preparation PDFs
- Books
- Slides (image-based slide decks)

The website must be lightweight, easy to maintain, and automatically grow as new resources are added to the repository.

The project will initially be hosted as a static site and later may evolve into a larger application if needed.

Key priorities:

- Minimal maintenance
- Fast loading
- Clean and intuitive UI
- Easy navigation
- Automatic content discovery from repository folders

---

## 2. Technology Stack

The site must be built using only:

- HTML
- CSS
- Vanilla JavaScript

No frameworks should be required for the initial version.

The site should be compatible with hosting on GitHub Pages.

Optional lightweight libraries may be used if necessary, but preference should be given to pure JavaScript solutions.

---

## 3. Content Philosophy

The site will act as a curated resource directory.

It will NOT include original educational tutorials such as:

- how to declare variables
- language basics
- programming lessons

Those are widely available elsewhere.

Instead the site will focus on sharing resources such as:

- Cheatsheets
- Interview prep PDFs
- Study materials
- Slide decks
- Visual learning resources

The goal is to make it easy for developers to quickly access useful materials.

---

## 4. Repository Content Structure

All learning resources will be stored inside a `/content` directory.

The structure must support unlimited technologies and categories.

Example structure:

/content
    /javascript
        /cheatsheets
        /interview
        /books
        /slides
            /ajax
                01.png
                02.png
                03.png
    /python
    /java
    /php
    /docker
    /react

The site must automatically support any new technology folders added later.

---

## 5. Supported Resource Categories

Each technology folder may contain the following categories:

- cheatsheets
- interview
- books
- slides

More categories may be added in the future.

The site must not require code changes when new technologies or resources are added.

---

## 6. Slides Content Structure

Slides are stored as folders containing ordered images.

Example:

/slides/ajax
    01.png
    02.png
    03.png
    04.png

Images must be displayed as a slideshow.

Slideshow requirements:

- next/previous navigation
- keyboard arrow support
- slide counter (example: 1 / 8)
- responsive for mobile
- optional autoplay (future feature)

Images should be displayed in correct order based on filename numbering.

---

## 7. Automatic Content Detection

The website must automatically generate navigation and pages based on the content directory.

However, since browsers cannot read directories directly, a generated content index file must be used.

Example file:

/data/content.json

This file will contain a structured index of available content.

Example:

{
  "javascript": {
    "cheatsheets": [
      "promises-cheatsheet.pdf",
      "array-methods.png"
    ],
    "slides": {
      "ajax": [
        "01.png",
        "02.png",
        "03.png"
      ]
    }
  }
}

JavaScript must read this file and dynamically generate pages and UI elements.

---

## 8. Website Navigation

The site should automatically generate the following hierarchy:

Home

Technology Pages:

/javascript
/python
/java
/php

Technology pages should show available categories:

Cheatsheets
Interview
Books
Slides

Category pages should show resource cards.

---

## 9. Resource Cards

Each resource should be displayed as a card.

Example fields:

- resource title
- type (PDF / image / slides)
- action button

Example UI:

JavaScript Promises Cheatsheet  
PDF  
Download

AJAX Slides  
8 slides  
Start Slideshow

---

## 10. Homepage Layout

The homepage should display all technologies as cards.

Example:

JavaScript  
Python  
Java  
PHP  
Docker  
React  

Technologies must be generated dynamically from content data.

---

## 11. Performance Requirements

The site must prioritize speed and simplicity.

Requirements:

- minimal JavaScript bundle size
- lazy loading images where possible
- compressed images
- responsive layout
- avoid heavy frameworks
- optimized loading for mobile devices

---

## 12. Search (Optional Phase 2)

Future versions may include search functionality.

Preferred approach:

Client-side search using a lightweight library.

Example:

Fuse.js

Search should allow users to find resources by:

- technology
- filename
- tags (if added later)

---

## 13. Disclaimer Page

The website must include a clear disclaimer page.

The disclaimer must state:

- resources are collected from publicly available sources
- the site does not claim ownership of third-party materials
- copyrights belong to respective owners
- content will be removed upon request

Contact email must be listed for removal requests:

mrugeshp.ai@gmail.com

---

## 14. Copyright / Removal Policy

A copyright policy page must exist.

It should explain that:

- the site acts as a curated directory
- copyright owners may request removal
- requests should include proof of ownership
- content will be removed after verification

Contact email:

mrugeshp.ai@gmail.com

---

## 15. Privacy Policy

A simple privacy policy page must be included.

It should state:

- the website does not collect personal data
- no personal information is stored
- emails sent by users may be retained only for communication

---

## 16. Footer Requirements

All pages must include footer links to:

Home  
Disclaimer  
Privacy Policy  
Copyright / Removal Policy  
Contact

---

## 17. Legal Safety Strategy

To reduce risk of copyright issues:

The site should prioritize sharing:

- cheatsheets
- community notes
- slides
- diagrams

The site should avoid hosting:

- paid course material
- copyrighted books from commercial publishers
- leaked training materials

When possible, the site should provide attribution to the original source.

---

## 18. Maintenance Workflow

The workflow for adding new content should be simple:

1. Add files into the appropriate `/content` folder
2. Update or regenerate `content.json`
3. Commit to repository
4. Website automatically displays the new content

No manual webpage creation should be required.

---

## 19. Scalability Requirements

The system must support:

- unlimited technologies
- unlimited resources
- unlimited slide decks

The UI must remain usable even when the content library grows significantly.

---

## 20. Future Expansion Possibilities

Future improvements may include:

- search
- tagging system
- topic pages
- better slideshow features
- improved navigation
- migration to a framework if needed

However, the initial version must remain simple and static.

---

## 21. Project Goals Summary

Primary goals:

- minimal maintenance
- automated content discovery
- fast static website
- clean developer-focused UI
- easy navigation of learning resources
- legal safety via disclaimers and removal policy

The site should function as a fast and organized resource library for developers.