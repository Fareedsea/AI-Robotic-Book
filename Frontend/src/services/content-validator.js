/**
 * Content Validator Service
 * Validates content quality, accuracy, and educational effectiveness
 */

import readabilityValidator from './readability-validator.js';
import logger from './logger.js';

class ContentValidator {
  constructor() {
    this.logger = logger;
    this.readabilityValidator = readabilityValidator;
    this.qualityThresholds = {
      accuracy: 0.85,
      clarity: 0.80,
      engagement: 0.75,
      educationalValue: 0.85
    };
  }

  /**
   * Validate content quality across multiple dimensions
   * @param {Object} content - Content to validate
   * @returns {Object} Validation results
   */
  validate(content) {
    this.logger.info('Starting content quality validation', {
      title: content.title,
      timestamp: new Date().toISOString()
    });

    const results = {
      isValid: true,
      issues: [],
      suggestions: [],
      scores: {},
      readability: {}
    };

    // Validate readability (delegated to readability validator)
    const readabilityResult = this.readabilityValidator.validate(content);
    results.readability = readabilityResult;
    if (!readabilityResult.isValid) {
      results.isValid = false;
      results.issues.push(...readabilityResult.issues);
      results.suggestions.push(...readabilityResult.suggestions);
    }

    // Validate content structure
    const structureResult = this.validateStructure(content);
    if (!structureResult.isValid) {
      results.isValid = false;
      results.issues.push(...structureResult.issues);
      results.suggestions.push(...structureResult.suggestions);
    }
    results.scores.structure = structureResult.score;

    // Validate content accuracy
    const accuracyResult = this.validateAccuracy(content);
    if (!accuracyResult.isValid) {
      results.isValid = false;
      results.issues.push(...accuracyResult.issues);
      results.suggestions.push(...accuracyResult.suggestions);
    }
    results.scores.accuracy = accuracyResult.score;

    // Validate content clarity
    const clarityResult = this.validateClarity(content);
    if (!clarityResult.isValid) {
      results.isValid = false;
      results.issues.push(...clarityResult.issues);
      results.suggestions.push(...clarityResult.suggestions);
    }
    results.scores.clarity = clarityResult.score;

    // Validate educational value
    const educationalResult = this.validateEducationalValue(content);
    if (!educationalResult.isValid) {
      results.isValid = false;
      results.issues.push(...educationalResult.issues);
      results.suggestions.push(...educationalResult.suggestions);
    }
    results.scores.educationalValue = educationalResult.score;

    // Log the overall validation result
    this.logger.info(`Content quality validation: ${results.isValid ? 'PASS' : 'FAIL'}`, {
      title: content.title,
      scores: results.scores,
      issueCount: results.issues.length
    });

    return results;
  }

  /**
   * Validate content structure and completeness
   * @param {Object} content - Content to validate
   * @returns {Object} Structure validation results
   */
  validateStructure(content) {
    const result = {
      isValid: true,
      issues: [],
      suggestions: [],
      score: 0
    };

    // Required sections for educational content
    const requiredSections = [
      'learningObjectives',
      'explanation',
      'steps',
      'commands',
      'summary',
      'practiceTasks'
    ];

    // Check for missing sections
    for (const section of requiredSections) {
      if (!content[section]) {
        result.isValid = false;
        result.issues.push(`Required section '${section}' is missing`);
        result.suggestions.push(`Add the ${this.formatSectionName(section)} section to improve completeness`);
      } else if (Array.isArray(content[section])) {
        if (content[section].length === 0) {
          result.isValid = false;
          result.issues.push(`Required section '${section}' is empty`);
          result.suggestions.push(`Add content to the ${this.formatSectionName(section)} section`);
        }
      } else if (typeof content[section] === 'string') {
        if (content[section].trim() === '') {
          result.isValid = false;
          result.issues.push(`Required section '${section}' is empty`);
          result.suggestions.push(`Add content to the ${this.formatSectionName(section)} section`);
        }
      }
    }

    // Check learning objectives count
    if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
      if (content.learningObjectives.length < 3) {
        result.isValid = false;
        result.issues.push(`Too few learning objectives (${content.learningObjectives.length}, minimum 3 required)`);
        result.suggestions.push(`Add at least ${3 - content.learningObjectives.length} more learning objectives`);
      }
    }

    // Check practice tasks count
    if (content.practiceTasks && Array.isArray(content.practiceTasks)) {
      if (content.practiceTasks.length < 2) {
        result.isValid = false;
        result.issues.push(`Too few practice tasks (${content.practiceTasks.length}, minimum 2 required)`);
        result.suggestions.push(`Add at least ${2 - content.practiceTasks.length} more practice tasks`);
      }
    }

    // Calculate structure score based on completeness
    let sectionsComplete = 0;
    let totalSections = requiredSections.length;

    for (const section of requiredSections) {
      if (content[section]) {
        if ((Array.isArray(content[section]) && content[section].length > 0) ||
            (typeof content[section] === 'string' && content[section].trim() !== '')) {
          sectionsComplete++;
        }
      }
    }

    result.score = totalSections > 0 ? sectionsComplete / totalSections : 1;
    return result;
  }

  /**
   * Validate content accuracy
   * @param {Object} content - Content to validate
   * @returns {Object} Accuracy validation results
   */
  validateAccuracy(content) {
    const result = {
      isValid: true,
      issues: [],
      suggestions: [],
      score: 0
    };

    // Check for common accuracy issues
    const text = this.extractTextForValidation(content);

    // Look for ambiguous language
    const ambiguousPhrases = [
      'maybe', 'perhaps', 'possibly', 'it could be', 'some say', 'probably'
    ];

    const foundAmbiguous = ambiguousPhrases.filter(phrase =>
      new RegExp('\\b' + phrase + '\\b', 'gi').test(text)
    );

    if (foundAmbiguous.length > 0) {
      result.issues.push(`Potential ambiguity detected: ${foundAmbiguous.join(', ')}`);
      result.suggestions.push('Use more definitive language to improve accuracy');
    }

    // Check for unsupported claims
    const claimPattern = /(this is proven|everyone knows|it's obvious|always|never)/gi;
    const claims = text.match(claimPattern) || [];
    if (claims.length > 0) {
      result.issues.push(`Potentially unsupported claims detected: ${claims.join(', ')}`);
      result.suggestions.push('Provide evidence or sources for strong claims');
    }

    // Calculate accuracy score based on issues found
    // Higher number of issues means lower accuracy score
    const issueCount = result.issues.length;
    result.score = Math.max(0, 1 - (issueCount * 0.2)); // Each issue reduces score by 20%

    return result;
  }

  /**
   * Validate content clarity
   * @param {Object} content - Content to validate
   * @returns {Object} Clarity validation results
   */
  validateClarity(content) {
    const result = {
      isValid: true,
      issues: [],
      suggestions: [],
      score: 0
    };

    const text = this.extractTextForValidation(content);

    // Check for jargon without explanation
    const jargonPattern = /\b([A-Z]{3,}|[A-Z][a-z]+[A-Z]\w*)\b/g;
    const jargonMatches = text.match(jargonPattern) || [];
    if (jargonMatches.length > 0) {
      // In a real implementation, we'd check if these terms are explained
      result.issues.push(`Potential jargon detected: ${Array.from(new Set(jargonMatches)).join(', ')}`);
      result.suggestions.push('Explain technical terms when first introduced');
    }

    // Check sentence complexity
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0
      ? text.split(/\s+/).length / sentences.length
      : 0;

    if (avgWordsPerSentence > 25) {
      result.issues.push(`Sentences are too complex (average ${Math.round(avgWordsPerSentence)} words, recommended max 25)`);
      result.suggestions.push('Break up long sentences to improve clarity');
    }

    // Check for unclear pronouns
    const unclearPronouns = text.match(/\b(it|this|that|these|those)\b/gi) || [];
    if (unclearPronouns.length > 0) {
      result.suggestions.push('Ensure pronouns have clear antecedents to avoid confusion');
    }

    // Calculate clarity score
    const issueCount = result.issues.length;
    result.score = Math.max(0, 1 - (issueCount * 0.15)); // Each issue reduces score by 15%

    return result;
  }

  /**
   * Validate educational value
   * @param {Object} content - Content to validate
   * @returns {Object} Educational value validation results
   */
  validateEducationalValue(content) {
    const result = {
      isValid: true,
      issues: [],
      suggestions: [],
      score: 0
    };

    // Check for educational structure
    if (!content.learningObjectives) {
      result.isValid = false;
      result.issues.push('No learning objectives specified');
      result.suggestions.push('Add clear learning objectives at the beginning of the chapter');
    } else if (Array.isArray(content.learningObjectives) && content.learningObjectives.length > 0) {
      // Validate each learning objective
      for (let i = 0; i < content.learningObjectives.length; i++) {
        const obj = content.learningObjectives[i];
        if (!this.isValidLearningObjective(obj)) {
          result.issues.push(`Learning objective ${i+1} may not be well-formed: "${obj}"`);
          result.suggestions.push('Use action verbs and make objectives measurable');
        }
      }
    }

    // Check for summary
    if (!content.summary) {
      result.isValid = false;
      result.issues.push('No chapter summary provided');
      result.suggestions.push('Add a summary that recaps key points');
    }

    // Check for practice tasks
    if (!content.practiceTasks) {
      result.isValid = false;
      result.issues.push('No practice tasks provided');
      result.suggestions.push('Add hands-on tasks to reinforce learning');
    }

    // Calculate educational value score
    let score = 0.5; // Base score

    if (content.learningObjectives) score += 0.2;
    if (content.summary) score += 0.15;
    if (content.practiceTasks) score += 0.15;

    result.score = Math.min(1, score);

    return result;
  }

  /**
   * Extract text content for validation
   * @param {Object} content - Content object
   * @returns {string} Plain text
   */
  extractTextForValidation(content) {
    let text = '';

    if (content.title) text += content.title + ' ';
    if (content.explanation) text += content.explanation + ' ';
    if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
      text += content.learningObjectives.join(' ') + ' ';
    }
    if (content.steps && Array.isArray(content.steps)) {
      text += content.steps.join(' ') + ' ';
    }
    if (content.commands && Array.isArray(content.commands)) {
      text += content.commands.join(' ') + ' ';
    }
    if (content.summary) text += content.summary + ' ';
    if (content.practiceTasks && Array.isArray(content.practiceTasks)) {
      text += content.practiceTasks.join(' ') + ' ';
    }

    return text;
  }

  /**
   * Check if a learning objective is well-formed
   * @param {string} objective - Learning objective text
   * @returns {boolean} Whether the objective is valid
   */
  isValidLearningObjective(objective) {
    // Check if it starts with an action verb (basic heuristic)
    const actionVerbs = [
      'understand', 'explain', 'describe', 'identify', 'apply', 'analyze',
      'evaluate', 'create', 'demonstrate', 'compare', 'contrast', 'summarize'
    ];

    const lowerObj = objective.toLowerCase();
    const startsWithAction = actionVerbs.some(verb => lowerObj.startsWith(verb));

    // Also consider it valid if it's specific and measurable
    return startsWithAction || objective.length > 10; // Basic length check
  }

  /**
   * Format section name for display
   * @param {string} sectionName - Raw section name
   * @returns {string} Formatted section name
   */
  formatSectionName(sectionName) {
    // Convert camelCase to readable format (e.g. "learningObjectives" -> "Learning Objectives")
    return sectionName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}

// Export the content validator
const contentValidator = new ContentValidator();
export default contentValidator;