import { describe, it, expect } from 'vitest';
import { render, screen, within} from '@testing-library/react';
import TicketSummaryCards from './TicketSummaryCards.jsx';
import { sampleTickets } from '../test/testUtils.jsx';

describe('TicketSummaryCards component', () => {
  it('renders summary cards with correct values', () => {
    render(<TicketSummaryCards tickets={sampleTickets} />);

    const summary = screen.getByLabelText('Ticket summary');

    expect(within(summary).getByText('Total Tickets')).toBeInTheDocument();
    expect(within(summary).getByText('OPEN')).toBeInTheDocument();
    expect(within(summary).getByText('IN_PROGRESS')).toBeInTheDocument();
    expect(within(summary).getByText('CLOSED')).toBeInTheDocument();
    expect(within(summary).getByText('3')).toBeInTheDocument(); // Total Tickets
  });
  
});