/**
 * A user tutorial.
 */
export default class Tutorial {
    id
    message
    targetElements
    startTriggers
    completionTriggers
    willHighlightTargets
    /**
     *  @param {string} id - The unique identifier for the tutorial.
     *  @param {string} message - The message to display to the user.
     *  @param {string[]} targetElements - The elements to highlight.
     *  @param {array} startTriggers - The matcher for the conditions which will start the tutorial.
     *  @param {array} completionTriggers - The matcher for the conditions which will complete the tutorial.
     *  @param {boolean} highlightTarget - Whether to darken the ui to highlight the target elements.
     */
    constructor(id, message, targetElements, startTriggers, completionTriggers, highlightTarget = true) {
        this.id = id;
        this.message = message;
        this.targetElements = targetElements;
        // TODO : Validate triggers
        this.startTriggers = Array.isArray(startTriggers) ? startTriggers : (startTriggers ? [startTriggers] : []);
        this.willHighlightTargets = highlightTarget;
        // TODO : Validate triggers
        this.completionTriggers = Array.isArray(completionTriggers) ? completionTriggers : (completionTriggers ? [completionTriggers] : []);
        this.status = 0;
    }
}