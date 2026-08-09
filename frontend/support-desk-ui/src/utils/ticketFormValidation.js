// Validation rules for the ticket form wizard.
//
// These used to live inside TicketFormWizard.jsx. They are pure functions here:
// they take values in and return a result, they never touch React state.
// That means they can be tested without rendering the form.

export const TICKET_STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
export const TICKET_PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

// Reads one text field safely, so a missing field is treated as empty text
function readText(value) {
    return (value ?? '').trim();
}

/**
 * Checks one step of the wizard.
 *
 * @param {object} formValues  the current form values
 * @param {number} stepToValidate  1, 2 or 3
 * @param {boolean} reviewConfirmed  whether the step 3 checkbox is ticked
 * @returns {object} field name -> error message. Empty object means the step is valid.
 */
export function validateTicketFormStep(formValues, stepToValidate, reviewConfirmed) {
    const errors = {};

    if (stepToValidate === 1) {
        if (!readText(formValues.title)) {
            errors.title = 'Ticket title is required.';
        }

        if (!readText(formValues.description)) {
            errors.description = 'Ticket description is required.';
        }

        if (!readText(formValues.category)) {
            errors.category = 'Ticket category is required.';
        }
    }

    if (stepToValidate === 2) {
        if (!TICKET_PRIORITY_OPTIONS.includes(formValues.priority)) {
            errors.priority = 'Choose a valid priority';
        }

        if (!TICKET_STATUS_OPTIONS.includes(formValues.status)) {
            errors.status = 'Choose a valid status';
        }

        if (readText(formValues.assignedTo) && !readText(formValues.assignedTo).includes('@')) {
            errors.assignedTo = 'Assigned user should look like an email address.';
        }
    }

    if (stepToValidate === 3 && !reviewConfirmed) {
        errors.review = 'Please confirm that you reviewed the ticket details.';
    }

    return errors;
}

/**
 * True when the given step has no errors.
 */
export function isTicketFormStepValid(formValues, stepToValidate, reviewConfirmed) {
    return Object.keys(validateTicketFormStep(formValues, stepToValidate, reviewConfirmed)).length === 0;
}

/**
 * Builds the object that gets sent to the backend:
 * text fields are trimmed, and a blank assignedTo is sent as null rather than ''.
 */
export function normalizeTicketFormPayload(formValues) {
    return {
        title: readText(formValues.title),
        description: readText(formValues.description),
        category: readText(formValues.category),
        priority: formValues.priority,
        status: formValues.status,
        assignedTo: readText(formValues.assignedTo) || null
    };
}

/**
 * The label shown for a field on the review step.
 *
 * The review grid currently prints the raw key ("assignedTo"), so this returns the
 * key unchanged to keep the form looking exactly the same after the refactor.
 * Turning these into readable labels ("Assigned To") is a visible UI change and
 * belongs in its own commit, not in a refactor.
 */
export function formatTicketFormLabel(key) {
    return key;
}
