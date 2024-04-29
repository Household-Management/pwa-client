/**
 * A user tutorial.
 */
export default class Tutorial {
    id
    message
    targetElements
    startMatcher
    completionMatcher
    willHighlightTargets
    /**
     *  @param {string} id - The unique identifier for the tutorial.
     *  @param {string} message - The message to display to the user.
     *  @param {string[]} targetElements - The elements to highlight.
     *  @param {object} startMatcher - The matcher for the conditions which will start the tutorial.
     *  @param {object} completionMatcher - The matcher for the conditions which will complete the tutorial.
     *  @param {boolean} highlightTarget - Whether to darken the ui to highlight the target elements.
     */
    constructor(id, message, targetElements, startMatcher, completionMatcher, highlightTarget = true) {
        this.id = id;
        this.message = message;
        this.targetElements = targetElements;
        // TODO : Validate completion matcher
        this.startMatcher = startMatcher;
        this.willHighlightTargets = highlightTarget;
        // TODO : Validate completion matcher
        this.completionMatcher = completionMatcher;
    }
}