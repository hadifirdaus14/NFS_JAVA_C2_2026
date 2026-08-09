import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TicketSummaryCards from './TicketSummaryCards.jsx';

// A purpose-built fixture with a DIFFERENT count per status.
// The shared sampleTickets fixture has exactly one ticket per status, so a bug that
// swapped the OPEN and CLOSED counts would still pass. These counts make that fail.
const countedTickets = [
  { id: 'T001', title: 'Cannot access email', category: 'Email', status: 'OPEN', priority: 'HIGH' },
  { id: 'T002', title: 'VPN keeps dropping', category: 'Network', status: 'OPEN', priority: 'MEDIUM' },
  { id: 'T003', title: 'Monitor flickering', category: 'Hardware', status: 'OPEN', priority: 'LOW' },
  { id: 'T004', title: 'Laptop running slowly', category: 'Hardware', status: 'OPEN', priority: 'LOW' },
  { id: 'T005', title: 'Printer jamming', category: 'Hardware', status: 'IN_PROGRESS', priority: 'LOW' },
  { id: 'T006', title: 'Password reset request', category: 'Account', status: 'IN_PROGRESS', priority: 'LOW' },
  { id: 'T007', title: 'Shared drive access', category: 'Access', status: 'CLOSED', priority: 'LOW' }
];
// total 7, OPEN 4, IN_PROGRESS 2, CLOSED 1

describe('TicketSummaryCards component', () => {
  it('renders a card for the total and for each status', () => {
    render(<TicketSummaryCards tickets={countedTickets} />);

    const summary = screen.getByLabelText('Ticket summary');

    expect(within(summary).getByText('Total Tickets')).toBeInTheDocument();
    expect(within(summary).getByText('OPEN')).toBeInTheDocument();
    expect(within(summary).getByText('IN_PROGRESS')).toBeInTheDocument();
    expect(within(summary).getByText('CLOSED')).toBeInTheDocument();
  });

  it('shows the total number of tickets on the Total Tickets card', () => {
    render(<TicketSummaryCards tickets={countedTickets} />);

    const totalCard = screen.getByRole('article', { name: 'Total Tickets' });

    expect(within(totalCard).getByText('7')).toBeInTheDocument();
  });

  it('shows each status count on its own card', () => {
    render(<TicketSummaryCards tickets={countedTickets} />);

    // Ask for a named card, then read the number inside it. This fails if a count
    // ends up on the wrong card, which a plain getByText('4') would not catch.
    expect(within(screen.getByRole('article', { name: 'OPEN' })).getByText('4')).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'IN_PROGRESS' })).getByText('2')).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'CLOSED' })).getByText('1')).toBeInTheDocument();
  });

  it('shows zero for a status with no tickets', () => {
    render(<TicketSummaryCards tickets={[]} />);

    expect(within(screen.getByRole('article', { name: 'Total Tickets' })).getByText('0')).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'OPEN' })).getByText('0')).toBeInTheDocument();
  });
});
