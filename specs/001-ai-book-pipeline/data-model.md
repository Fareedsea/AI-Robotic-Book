# Data Model: AI/Spec-Driven Book Creation

## Book Content Structure

### Chapter Entity
- **id**: string (unique identifier, e.g., "chapter-1", "chapter-2")
- **title**: string (chapter title)
- **learningObjectives**: string[] (list of learning objectives)
- **content**: string (main explanation content)
- **steps**: string[] (step-by-step instructions)
- **commands**: string[] (command examples with explanations)
- **summary**: string (chapter summary)
- **practiceTasks**: string[] (practice exercises for users)
- **frontmatter**: object (Docusaurus metadata like sidebar_position, description)

### Book Entity
- **title**: string ("AI/Spec-Driven Book Creation")
- **chapters**: Chapter[] (array of 10 chapters)
- **metadata**: object (author, date, version, etc.)
- **navigation**: object (sidebar configuration, table of contents)

## Docusaurus-Specific Structures

### Frontmatter Schema
- **title**: string (display title)
- **sidebar_label**: string (navigation label)
- **sidebar_position**: number (navigation order)
- **description**: string (SEO description)
- **keywords**: string[] (SEO keywords)

### Navigation Structure
- **sidebar**: array of navigation items
- **category**: grouping chapters by topic
- **links**: internal cross-references between chapters

## Validation Rules

### Content Requirements
- Each chapter must have 6 required sections: Learning Objectives, Explanation, Steps, Commands, Summary, Practice Tasks
- Content must meet Grade 8-10 readability standards
- All commands must be validated in real environments
- Content must be plagiarism-free

### Quality Constraints
- Minimum 1,200 words per chapter (to reach 12,000-18,000 total)
- Each chapter must have at least 3 practice tasks
- All code examples must be functional
- All external references must be properly cited

## State Transitions

### Chapter States
- **draft**: Initial state after AI generation
- **review**: Under human review for accuracy and quality
- **validated**: Commands tested and content verified
- **published**: Included in the final book

## Relationships

### Chapter Dependencies
- Chapter N may reference concepts introduced in Chapter N-1
- Cross-chapter navigation links for related topics
- Sequential learning progression maintained throughout the book