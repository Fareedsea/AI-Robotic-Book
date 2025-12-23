/**
 * Readability Validator Service
 * Validates content readability against Grade 8-10 standards
 */

import logger from './logger.js';

class ReadabilityValidator {
  constructor() {
    this.logger = logger;
    this.readabilityStandards = {
      minGradeLevel: 8,
      maxGradeLevel: 10,
      targetGradeLevel: 9,
      // Flesch Reading Ease scores corresponding to grade levels
      fleschScores: {
        8: 60,  // Fairly difficult
        9: 65,  // Plain English
        10: 70  // Fairly easy
      }
    };
  }

  /**
   * Validate the readability of content
   * @param {Object} content - Content to validate
   * @returns {Object} Validation results
   */
  validate(content) {
    const text = this.extractTextFromContent(content);
    const stats = this.analyzeText(text);
    const fleschScore = this.calculateFleschReadingEase(stats);
    const gradeLevel = this.fleschToGradeLevel(fleschScore);

    this.logger.debug('Readability analysis complete', {
      fleschScore,
      gradeLevel,
      wordCount: stats.wordCount,
      sentenceCount: stats.sentenceCount,
      syllableCount: stats.syllableCount
    });

    const result = {
      isValid: true,
      gradeLevel,
      fleschScore,
      issues: [],
      suggestions: []
    };

    // Check if grade level is within acceptable range
    if (gradeLevel < this.readabilityStandards.minGradeLevel) {
      result.isValid = false;
      result.issues.push(`Content readability is too low (grade level ${gradeLevel}, minimum ${this.readabilityStandards.minGradeLevel} required)`);
      result.suggestions.push('Consider using more complex terminology or longer sentences to raise readability level');
    } else if (gradeLevel > this.readabilityStandards.maxGradeLevel) {
      result.isValid = false;
      result.issues.push(`Content readability is too high (grade level ${gradeLevel}, maximum ${this.readabilityStandards.maxGradeLevel} allowed)`);
      result.suggestions.push('Simplify language, use shorter sentences, and avoid jargon to lower readability level');
    }

    // Additional analysis for improvement suggestions
    if (stats.averageWordsPerSentence > 25) {
      result.suggestions.push('Consider breaking up long sentences to improve readability');
    }

    if (stats.bigWordCount / stats.wordCount > 0.05) { // More than 5% complex words
      result.suggestions.push('Try to reduce the use of complex words with 3+ syllables');
    }

    // Log the validation result
    this.logger.info(`Content readability validation: ${result.isValid ? 'PASS' : 'FAIL'}`, {
      gradeLevel,
      fleschScore,
      issues: result.issues,
      suggestions: result.suggestions
    });

    return result;
  }

  /**
   * Extract text content from structured content object
   * @param {Object} content - Content object
   * @returns {string} Plain text
   */
  extractTextFromContent(content) {
    let text = '';

    // Add title
    if (content.title) {
      text += content.title + ' ';
    }

    // Add explanation
    if (content.explanation) {
      text += content.explanation + ' ';
    }

    // Add learning objectives
    if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
      text += content.learningObjectives.join(' ') + ' ';
    }

    // Add steps
    if (content.steps && Array.isArray(content.steps)) {
      text += content.steps.join(' ') + ' ';
    }

    // Add commands (but only the descriptive parts)
    if (content.commands && Array.isArray(content.commands)) {
      content.commands.forEach(cmd => {
        // Extract just the description part, not the command syntax
        text += cmd.replace(/^#.*$/gm, '').replace(/^\s*\$\s*/gm, '') + ' ';
      });
    }

    // Add summary
    if (content.summary) {
      text += content.summary + ' ';
    }

    // Add practice tasks
    if (content.practiceTasks && Array.isArray(content.practiceTasks)) {
      text += content.practiceTasks.join(' ') + ' ';
    }

    return text;
  }

  /**
   * Analyze text for readability statistics
   * @param {string} text - Text to analyze
   * @returns {Object} Statistics
   */
  analyzeText(text) {
    // Remove extra whitespace and normalize
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Count words
    const wordMatch = cleanText.match(/\b\w+\b/g);
    const wordCount = wordMatch ? wordMatch.length : 0;

    // Count sentences (ends with ., !, or ?)
    const sentenceMatch = cleanText.match(/[.!?]+/g);
    const sentenceCount = sentenceMatch ? sentenceMatch.length : 1; // Default to 1 if no sentences found

    // Count syllables
    let syllableCount = 0;
    let bigWordCount = 0; // Words with 3+ syllables

    if (wordMatch) {
      wordMatch.forEach(word => {
        const syllables = this.countSyllables(word);
        syllableCount += syllables;
        if (syllables >= 3) {
          bigWordCount++;
        }
      });
    }

    const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const averageSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;

    return {
      wordCount,
      sentenceCount,
      syllableCount,
      bigWordCount,
      averageWordsPerSentence,
      averageSyllablesPerWord
    };
  }

  /**
   * Count syllables in a word using a simplified algorithm
   * @param {string} word - Word to analyze
   * @returns {number} Syllable count
   */
  countSyllables(word) {
    word = word.toLowerCase();

    // Special case for short words
    if (word.length <= 3) {
      return 1;
    }

    // Count vowel groups
    let syllableCount = 0;
    let prevWasVowel = false;

    const vowels = 'aeiouy';
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.indexOf(word[i]) !== -1;
      if (isVowel && !prevWasVowel) {
        syllableCount++;
      }
      prevWasVowel = isVowel;
    }

    // Subtract 1 if word ends with 'e' (silent e rule)
    if (word.endsWith('e') && syllableCount > 1) {
      syllableCount--;
    }

    // Every word has at least one syllable
    return Math.max(1, syllableCount);
  }

  /**
   * Calculate Flesch Reading Ease score
   * @param {Object} stats - Text statistics
   * @returns {number} Flesch score
   */
  calculateFleschReadingEase(stats) {
    // Flesch Reading Ease formula:
    // 206.835 - (1.015 × ASL) - (84.6 × ASW)
    // ASL = Average Sentence Length (words / sentences)
    // ASW = Average Syllables per Word (syllables / words)

    if (stats.wordCount === 0) {
      return 100; // Perfectly readable if no text
    }

    const averageSentenceLength = stats.sentenceCount > 0 ? stats.wordCount / stats.sentenceCount : 0;
    const averageSyllablesPerWord = stats.wordCount > 0 ? stats.syllableCount / stats.wordCount : 0;

    const score = 206.835 - (1.015 * averageSentenceLength) - (84.6 * averageSyllablesPerWord);

    // Ensure score is within reasonable bounds
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Convert Flesch score to approximate grade level
   * @param {number} fleschScore - Flesch reading ease score
   * @returns {number} Approximate grade level
   */
  fleschToGradeLevel(fleschScore) {
    // This is a reverse calculation from Flesch-Kincaid Grade Level formula
    // Grade Level ≈ (0.39 × ASL) + (11.8 × ASW) - 15.59
    // But we'll use a simpler approximation based on Flesch scores:
    // Score 90-100 = 5th grade, 80-90 = 6th grade, ..., 60-70 = 8th grade, etc.
    if (fleschScore >= 90) return 5;
    if (fleschScore >= 80) return 6;
    if (fleschScore >= 75) return 7;
    if (fleschScore >= 70) return 8;
    if (fleschScore >= 65) return 9;
    if (fleschScore >= 60) return 10;
    if (fleschScore >= 55) return 11;
    if (fleschScore >= 50) return 12;
    return 13; // College level or higher
  }

  /**
   * Get readability improvement suggestions
   * @param {Object} content - Content to analyze
   * @returns {Array<string>} Suggestions for improvement
   */
  getImprovementSuggestions(content) {
    const text = this.extractTextFromContent(content);
    const stats = this.analyzeText(text);

    const suggestions = [];

    if (stats.averageWordsPerSentence > 20) {
      suggestions.push('Break up long sentences. Aim for 15-20 words per sentence.');
    }

    if (stats.bigWordCount / stats.wordCount > 0.05) {
      suggestions.push('Replace complex words (3+ syllables) with simpler alternatives where possible.');
    }

    if (stats.averageSyllablesPerWord > 2) {
      suggestions.push('Use shorter words to reduce the average syllable count.');
    }

    return suggestions;
  }
}

// Export the readability validator
const readabilityValidator = new ReadabilityValidator();
export default readabilityValidator;