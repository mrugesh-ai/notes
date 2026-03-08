# AGENTS.md

## Purpose

This file provides guidance for AI coding agents working on the Dev Resource Library project.

The project is a lightweight static website that organizes developer learning resources such as cheatsheets, interview preparation PDFs, books, and slide decks.

The main goal is to keep the project simple, maintainable, and scalable as content grows.

AI agents should prioritize clarity, performance, and minimal complexity when making changes.

---

## Core Principles

Agents must follow these principles when contributing code:

1. Keep the project lightweight.
2. Avoid introducing heavy frameworks.
3. Use plain HTML, CSS, and vanilla JavaScript.
4. Maintain fast page load times.
5. Preserve the automatic content discovery system.
6. Keep the UI simple and easy to navigate.

---

## Project Architecture

The project uses a folder-based content management system.

All learning materials are stored inside the `/content` directory.

Example:

content/
  javascript/
    cheatsheets/
    interview/
    books/
    slides/
      ajax/
        01.png
        02.png

The website dynamically builds navigation using a content index file.

data/content.json

Agents should not hardcode technologies or resources in HTML files.

All content must be generated dynamically using JavaScript.

---

## Automatic Content System

Browsers cannot read directory structures directly.

Therefore the system relies on a generated index file:

data/content.json

Example structure:

{
  "javascript": {
    "cheatsheets": ["promises-cheatsheet.pdf"],
    "slides": {
      "ajax": ["01.png","02.png"]
    }
  }
}

Agents must ensure UI components use this data source.

---

## Slides System

Slides are image-based presentations.

Example folder:

content/javascript/slides/ajax/

Images must be displayed as a slideshow.

Required slideshow features:

- next/previous navigation
- keyboard arrow navigation
- slide counter
- responsive layout

Slides must appear in filename order.

---

## UI Responsibilities

The UI must remain clean and minimal.

Key UI components:

Home Page  
Technology Pages  
Category Pages  
Resource Cards  
Slide Viewer  

Agents should prioritize readability and ease of navigation.

---

## Performance Requirements

Agents must ensure the site remains fast.

Guidelines:

- keep JavaScript minimal
- lazy-load images when possible
- avoid large dependencies
- maintain responsive design
- optimize rendering performance

---

## Legal Pages

The website must include the following pages:

Disclaimer  
Privacy Policy  
Copyright / Removal Policy  

These pages must remain accessible from the site footer.

---

## Safety Guidelines

This project organizes publicly available resources.

Agents should avoid adding or encouraging distribution of:

- pirated books
- paid course materials
- leaked training documents

The site must include clear instructions for content removal requests.

Contact email:

mrugeshp.ai@gmail.com

---

## Contribution Workflow

Agents should follow this workflow when modifying the project:

1. Maintain existing folder structure
2. Avoid breaking dynamic content loading
3. Keep UI consistent
4. Ensure changes do not reduce performance

---

## Future Expansion

The system may later support:

- search functionality
- tagging
- better filtering
- improved slideshow viewer
- additional resource categories

Agents should design code in a way that allows future expansion without major rewrites.