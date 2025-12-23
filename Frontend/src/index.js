/**
 * Main entry point for the AI Book Creation Pipeline
 * Orchestrates the book generation process
 */

import contentGenerator from './services/content-generator.js';
import logger from './services/logger.js';

class AIBookPipeline {
  constructor() {
    this.generator = contentGenerator;
    this.logger = logger;
  }

  /**
   * Generate a complete book with multiple chapters
   * @param {Object} options - Book generation options
   * @param {Array<Object>} options.chapters - Chapter specifications
   * @returns {Promise<Object>} Generated book
   */
  async generateBook(options) {
    const { chapters } = options;
    const book = {
      title: options.title || 'AI-Generated Book',
      chapters: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        wordCount: 0,
        chapterCount: 0
      }
    };

    this.logger.info('Starting book generation process', {
      chapterCount: chapters.length,
      title: book.title
    });

    for (const chapterSpec of chapters) {
      try {
        this.logger.info(`Generating chapter: ${chapterSpec.title}`);

        const chapter = await this.generator.generateChapter(chapterSpec);
        const validation = this.generator.validateContent(chapter);

        if (!validation.isValid) {
          this.logger.warn(`Chapter validation issues: ${validation.issues.join(', ')}`, {
            chapter: chapterSpec.title,
            issues: validation.issues
          });
        }

        book.chapters.push({
          ...chapter,
          id: chapterSpec.id || `chapter-${book.chapters.length + 1}`
        });

        this.logger.logChapterGeneration(chapterSpec.title, 'completed', {
          wordCount: chapter.metadata.wordCount,
          readability: chapter.metadata.readabilityLevel
        });
      } catch (error) {
        this.logger.error(`Failed to generate chapter ${chapterSpec.title}: ${error.message}`, {
          error: error.stack
        });
        throw error;
      }
    }

    // Calculate book metadata
    book.metadata.chapterCount = book.chapters.length;
    book.metadata.wordCount = book.chapters.reduce(
      (total, chapter) => total + chapter.metadata.wordCount, 0
    );

    this.logger.logBookBuild('completed', {
      chapterCount: book.metadata.chapterCount,
      totalWordCount: book.metadata.wordCount
    });

    return book;
  }

  /**
   * Validate the entire book
   * @param {Object} book - The generated book
   * @returns {Object} Validation results
   */
  validateBook(book) {
    const results = {
      isValid: true,
      issues: [],
      suggestions: []
    };

    // Check overall book requirements
    if (book.chapters.length < 10) {
      results.issues.push(`Book has only ${book.chapters.length} chapters, minimum 10 required`);
      results.isValid = false;
    }

    if (book.metadata.wordCount < 12000) {
      results.issues.push(`Book has only ${book.metadata.wordCount} words, minimum 12,000 required`);
      results.isValid = false;
    }

    // Validate each chapter
    for (const chapter of book.chapters) {
      const chapterValidation = this.generator.validateContent(chapter);
      if (!chapterValidation.isValid) {
        results.issues.push(`Chapter "${chapter.title}" has validation issues: ${chapterValidation.issues.join(', ')}`);
        results.isValid = false;
      }
    }

    return results;
  }
}

// Export the main class
export default AIBookPipeline;

// Example usage (for testing):
/*
const bookGenerator = new AIBookPipeline();

const bookSpec = {
  title: 'AI-Driven Book Creation Guide',
  chapters: [
    {
      id: 'chapter-1',
      title: 'Introduction to AI-Driven Book Creation',
      topics: ['AI writing', 'Spec-Kit Plus', 'Claude Code', 'Docusaurus', 'GitHub Pages'],
      targetAudience: 'beginner to intermediate'
    }
    // Add more chapters as needed
  ]
};

bookGenerator.generateBook(bookSpec)
  .then(book => {
    console.log('Book generated successfully!', book.metadata);
    const validation = bookGenerator.validateBook(book);
    console.log('Validation results:', validation);
  })
  .catch(error => {
    console.error('Error generating book:', error);
  });
*/