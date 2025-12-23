/**
 * Content Validation Model
 * Defines the structure and rules for content validation
 */

class ContentValidationModel {
  constructor() {
    this.rules = {
      readability: {
        minGradeLevel: 8,
        maxGradeLevel: 10,
        targetGradeLevel: 9
      },
      structure: {
        requiredSections: [
          'learningObjectives',
          'explanation',
          'steps',
          'commands',
          'summary',
          'practiceTasks'
        ],
        minLearningObjectives: 3,
        minPracticeTasks: 2,
        minWordCount: 1200,
        maxWordCount: 2000
      },
      quality: {
        clarityThreshold: 0.8,
        accuracyThreshold: 0.9,
        engagementThreshold: 0.7
      },
      plagiarism: {
        similarityThreshold: 0.05, // 5% maximum allowed similarity
        sources: ['official_docs', 'academic_papers', 'trusted_blogs']
      }
    };

    this.validationResults = {
      isValid: false,
      issues: [],
      suggestions: [],
      score: 0
    };
  }

  /**
   * Validate content against all rules
   * @param {Object} content - The content to validate
   * @returns {Object} Validation results
   */
  validate(content) {
    const results = { ...this.validationResults };
    results.issues = [];
    results.suggestions = [];

    // Check readability
    const readabilityResult = this.validateReadability(content);
    if (!readabilityResult.valid) {
      results.issues.push(...readabilityResult.issues);
      results.suggestions.push(...readabilityResult.suggestions);
    }

    // Check structure
    const structureResult = this.validateStructure(content);
    if (!structureResult.valid) {
      results.issues.push(...structureResult.issues);
      results.suggestions.push(...structureResult.suggestions);
    }

    // Check quality
    const qualityResult = this.validateQuality(content);
    if (!qualityResult.valid) {
      results.issues.push(...qualityResult.issues);
      results.suggestions.push(...qualityResult.suggestions);
    }

    // Check for plagiarism
    const plagiarismResult = this.validatePlagiarism(content);
    if (!plagiarismResult.valid) {
      results.issues.push(...plagiarismResult.issues);
      results.suggestions.push(...plagiarismResult.suggestions);
    }

    // Calculate overall validity and score
    results.isValid = results.issues.length === 0;
    results.score = this.calculateScore(content, results);

    return results;
  }

  /**
   * Validate readability requirements
   * @param {Object} content - The content to validate
   * @returns {Object} Readability validation results
   */
  validateReadability(content) {
    const result = {
      valid: true,
      issues: [],
      suggestions: []
    };

    if (!content.readabilityLevel) {
      result.valid = false;
      result.issues.push('Readability level not provided');
      result.suggestions.push('Calculate and include readability level in content metadata');
    } else if (content.readabilityLevel < this.rules.readability.minGradeLevel ||
               content.readabilityLevel > this.rules.readability.maxGradeLevel) {
      result.valid = false;
      result.issues.push(
        `Readability level (${content.readabilityLevel}) outside acceptable range (${this.rules.readability.minGradeLevel}-${this.rules.readability.maxGradeLevel})`
      );
      result.suggestions.push(`Adjust content to target grade level ${this.rules.readability.targetGradeLevel}`);
    }

    return result;
  }

  /**
   * Validate structural requirements
   * @param {Object} content - The content to validate
   * @returns {Object} Structure validation results
   */
  validateStructure(content) {
    const result = {
      valid: true,
      issues: [],
      suggestions: []
    };

    // Check required sections
    for (const section of this.rules.structure.requiredSections) {
      if (!content[section]) {
        result.valid = false;
        result.issues.push(`Required section '${section}' is missing`);
        result.suggestions.push(`Add the ${section} section to the content`);
      } else if (Array.isArray(content[section]) && content[section].length === 0) {
        result.valid = false;
        result.issues.push(`Required section '${section}' is empty`);
        result.suggestions.push(`Populate the ${section} section with content`);
      } else if (typeof content[section] === 'string' && content[section].trim() === '') {
        result.valid = false;
        result.issues.push(`Required section '${section}' is empty`);
        result.suggestions.push(`Populate the ${section} section with content`);
      }
    }

    // Check learning objectives count
    if (content.learningObjectives && Array.isArray(content.learningObjectives) &&
        content.learningObjectives.length < this.rules.structure.minLearningObjectives) {
      result.valid = false;
      result.issues.push(`Not enough learning objectives (${content.learningObjectives.length}, minimum ${this.rules.structure.minLearningObjectives} required)`);
      result.suggestions.push(`Add ${this.rules.structure.minLearningObjectives - content.learningObjectives.length} more learning objectives`);
    }

    // Check practice tasks count
    if (content.practiceTasks && Array.isArray(content.practiceTasks) &&
        content.practiceTasks.length < this.rules.structure.minPracticeTasks) {
      result.valid = false;
      result.issues.push(`Not enough practice tasks (${content.practiceTasks.length}, minimum ${this.rules.structure.minPracticeTasks} required)`);
      result.suggestions.push(`Add ${this.rules.structure.minPracticeTasks - content.practiceTasks.length} more practice tasks`);
    }

    // Check word count
    const wordCount = this.calculateWordCount(content);
    if (wordCount < this.rules.structure.minWordCount) {
      result.valid = false;
      result.issues.push(`Content too short (${wordCount} words, minimum ${this.rules.structure.minWordCount} required)`);
      result.suggestions.push(`Add approximately ${this.rules.structure.minWordCount - wordCount} more words`);
    } else if (wordCount > this.rules.structure.maxWordCount) {
      result.valid = false;
      result.issues.push(`Content too long (${wordCount} words, maximum ${this.rules.structure.maxWordCount} recommended)`);
      result.suggestions.push(`Consider reducing content by approximately ${wordCount - this.rules.structure.maxWordCount} words`);
    }

    return result;
  }

  /**
   * Validate content quality
   * @param {Object} content - The content to validate
   * @returns {Object} Quality validation results
   */
  validateQuality(content) {
    const result = {
      valid: true,
      issues: [],
      suggestions: []
    };

    // In a real implementation, this would use AI models to assess quality
    // For now, we'll check basic quality indicators

    // Check if content has proper depth
    if (content.explanation && typeof content.explanation === 'string' &&
        content.explanation.length < 500) {
      result.valid = false;
      result.issues.push('Explanation section is too brief');
      result.suggestions.push('Expand the explanation section with more detailed information');
    }

    // Check if steps are actionable
    if (content.steps && Array.isArray(content.steps) &&
        content.steps.some(step => step.length < 20)) {
      result.valid = false;
      result.issues.push('Some steps are too brief to be actionable');
      result.suggestions.push('Expand steps to be more detailed and actionable');
    }

    return result;
  }

  /**
   * Validate for plagiarism
   * @param {Object} content - The content to validate
   * @returns {Object} Plagiarism validation results
   */
  validatePlagiarism(content) {
    const result = {
      valid: true,
      issues: [],
      suggestions: []
    };

    // In a real implementation, this would call a plagiarism detection service
    // For now, we'll just check for any indication of plagiarism in metadata
    if (content.metadata && content.metadata.plagiarismCheck &&
        content.metadata.plagiarismCheck.similarity > this.rules.plagiarism.similarityThreshold) {
      result.valid = false;
      result.issues.push(`Content similarity too high (${content.metadata.plagiarismCheck.similarity * 100}%, maximum ${this.rules.plagiarism.similarityThreshold * 100}% allowed)`);
      result.suggestions.push('Revise content to reduce similarity with existing sources');
    }

    return result;
  }

  /**
   * Calculate word count of content
   * @param {Object} content - The content to analyze
   * @returns {number} Total word count
   */
  calculateWordCount(content) {
    let total = 0;

    // Count title
    if (content.title) {
      total += this.countWords(content.title);
    }

    // Count explanation
    if (content.explanation) {
      total += this.countWords(content.explanation);
    }

    // Count learning objectives
    if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
      content.learningObjectives.forEach(obj => total += this.countWords(obj));
    }

    // Count steps
    if (content.steps && Array.isArray(content.steps)) {
      content.steps.forEach(step => total += this.countWords(step));
    }

    // Count commands
    if (content.commands && Array.isArray(content.commands)) {
      content.commands.forEach(cmd => total += this.countWords(cmd));
    }

    // Count summary
    if (content.summary) {
      total += this.countWords(content.summary);
    }

    // Count practice tasks
    if (content.practiceTasks && Array.isArray(content.practiceTasks)) {
      content.practiceTasks.forEach(task => total += this.countWords(task));
    }

    return total;
  }

  /**
   * Count words in a string
   * @param {string} str - Input string
   * @returns {number} Word count
   */
  countWords(str) {
    if (!str || typeof str !== 'string') return 0;
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Calculate overall validation score
   * @param {Object} content - The content being validated
   * @param {Object} results - Validation results so far
   * @returns {number} Overall score (0-1)
   */
  calculateScore(content, results) {
    // Base score on number of issues (more issues = lower score)
    const issuePenalty = Math.min(results.issues.length * 0.1, 0.5); // Max 50% penalty for issues

    // Bonus for meeting requirements
    let bonus = 0;
    if (this.validateStructure(content).valid) bonus += 0.2;
    if (this.validateReadability(content).valid) bonus += 0.15;

    const score = Math.max(0, Math.min(1, 1 - issuePenalty + bonus));
    return parseFloat(score.toFixed(2));
  }
}

// Export the model
const contentValidationModel = new ContentValidationModel();
export default contentValidationModel;