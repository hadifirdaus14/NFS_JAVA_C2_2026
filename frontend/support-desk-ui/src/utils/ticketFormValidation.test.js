import { describe, it, expect } from 'vitest';
import {
    formatTicketFormLabel,
    isTicketFormStepValid,
    normalizeTicketFormPayload,
    validateTicketFormStep
} from './ticketFormValidation';

// A form that would pass every step, used as the starting point for each test
const validForm = {
    title: 'Laptop will not start',
    description: 'The laptop shows no lights when powered on.',
    category: 'Hardware',
    status: 'OPEN',
    priority: 'HIGH',
    assignedTo: ''
};

describe('validateTicketFormStep - step 1', () => {
    it('reports all three required fields when the form is empty', () => {
        const errors = validateTicketFormStep({ ...validForm, title: '', description: '', category: '' }, 1, false);

        expect(errors).toEqual({
            title: 'Ticket title is required.',
            description: 'Ticket description is required.',
            category: 'Ticket category is required.'
        });
    });

    it('treats whitespace-only text as missing', () => {
        const errors = validateTicketFormStep({ ...validForm, title: '   ' }, 1, false);

        expect(errors.title).toBe('Ticket title is required.');
    });

    it('returns no errors when the required fields are filled in', () => {
        expect(validateTicketFormStep(validForm, 1, false)).toEqual({});
    });

    it('ignores step 2 and step 3 rules', () => {
        // priority is invalid, but that rule belongs to step 2
        const errors = validateTicketFormStep({ ...validForm, priority: 'URGENT' }, 1, false);

        expect(errors).toEqual({});
    });
});

describe('validateTicketFormStep - step 2', () => {
    it('rejects a priority that is not in the allowed list', () => {
        const errors = validateTicketFormStep({ ...validForm, priority: 'URGENT' }, 2, false);

        expect(errors.priority).toBe('Choose a valid priority');
        expect(errors.status).toBeUndefined();
    });

    it('rejects a status that is not in the allowed list', () => {
        const errors = validateTicketFormStep({ ...validForm, status: 'BROKEN' }, 2, false);

        expect(errors.status).toBe('Choose a valid status');
    });

    it('rejects an assignedTo value that is not email shaped', () => {
        const errors = validateTicketFormStep({ ...validForm, assignedTo: 'not-an-email' }, 2, false);

        expect(errors.assignedTo).toBe('Assigned user should look like an email address.');
    });

    it('accepts a blank assignedTo because the field is optional', () => {
        expect(validateTicketFormStep({ ...validForm, assignedTo: '' }, 2, false)).toEqual({});
        expect(validateTicketFormStep({ ...validForm, assignedTo: '   ' }, 2, false)).toEqual({});
    });

    it('accepts an email shaped assignedTo', () => {
        expect(validateTicketFormStep({ ...validForm, assignedTo: 'agent@example.com' }, 2, false)).toEqual({});
    });
});

describe('validateTicketFormStep - step 3', () => {
    it('requires the review checkbox to be confirmed', () => {
        const errors = validateTicketFormStep(validForm, 3, false);

        expect(errors.review).toBe('Please confirm that you reviewed the ticket details.');
    });

    it('returns no errors once the review checkbox is confirmed', () => {
        expect(validateTicketFormStep(validForm, 3, true)).toEqual({});
    });
});

describe('isTicketFormStepValid', () => {
    it('is false when the step has errors and true when it does not', () => {
        expect(isTicketFormStepValid({ ...validForm, title: '' }, 1, false)).toBe(false);
        expect(isTicketFormStepValid(validForm, 1, false)).toBe(true);
    });
});

describe('normalizeTicketFormPayload', () => {
    it('trims the text fields', () => {
        const payload = normalizeTicketFormPayload({
            ...validForm,
            title: '  Padded title  ',
            description: '  Padded description  ',
            category: '  Hardware  '
        });

        expect(payload.title).toBe('Padded title');
        expect(payload.description).toBe('Padded description');
        expect(payload.category).toBe('Hardware');
    });

    it('sends null instead of an empty string for a blank assignedTo', () => {
        expect(normalizeTicketFormPayload({ ...validForm, assignedTo: '' }).assignedTo).toBeNull();
        expect(normalizeTicketFormPayload({ ...validForm, assignedTo: '   ' }).assignedTo).toBeNull();
    });

    it('keeps a real assignedTo value and trims it', () => {
        expect(normalizeTicketFormPayload({ ...validForm, assignedTo: '  agent@example.com  ' }).assignedTo)
            .toBe('agent@example.com');
    });

    it('builds exactly the shape the backend expects', () => {
        const payload = normalizeTicketFormPayload(validForm);

        expect(payload).toEqual({
            title: 'Laptop will not start',
            description: 'The laptop shows no lights when powered on.',
            category: 'Hardware',
            priority: 'HIGH',
            status: 'OPEN',
            assignedTo: null
        });
    });
});

describe('formatTicketFormLabel', () => {
    it('returns the field key unchanged, so the review step looks the same as before', () => {
        expect(formatTicketFormLabel('title')).toBe('title');
        expect(formatTicketFormLabel('assignedTo')).toBe('assignedTo');
    });
});
