import { describe, it, expect } from 'vitest';
import { countByStatus, filterTickets } from './tickets';
import { sampleTickets } from '../test/testUtils.jsx';

describe('ticket utility functions', () => {
    it('filters tickets by search text', () => {
        const result = filterTickets(sampleTickets, 'laptop', 'ALL');

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Laptop running slowly');
    });
    it('filters tickets by status', () => {
        const result = filterTickets(sampleTickets, '', 'OPEN');

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('T001');
    });
    it('Filtering by search text and status together', () => {
        const result = filterTickets(sampleTickets, 'Account', 'CLOSED');

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('T003');
    });
    it('Returning all tickets when search is empty and status is `ALL`', () => {
        const result = filterTickets(sampleTickets, '', 'ALL');

        expect(result).toHaveLength(3);
    });
});


