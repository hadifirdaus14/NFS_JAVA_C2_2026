import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketFormWizard from './TicketFormWizard';

describe('TicketFormWizard', () => {
    it('shows inline validation errors for empty required fields', async () => {
        const user = userEvent.setup();
        render(<TicketFormWizard onSubmit={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(screen.getByText('Ticket title is required.')).toBeInTheDocument();
        expect(screen.getByText('Ticket description is required.')).toBeInTheDocument();
        expect(screen.getByText('Ticket category is required.')).toBeInTheDocument();
    });

    it('submits valid form data', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<TicketFormWizard onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText('Title'), 'Test Ticket');
        await user.type(screen.getByLabelText('Description'), 'This is a test ticket.');
        await user.type(screen.getByLabelText('Category'), 'Bug');
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        //Fill in the second step
        await user.selectOptions(screen.getByLabelText('Priority'), 'HIGH');
        await user.selectOptions(screen.getByLabelText('Status'), 'OPEN');
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        //Fill in the third step
        await user.click(screen.getByLabelText('I have reviewed the ticket details and they are ready to submit.'));
        await user.click(screen.getByRole('button', { name: 'Create Ticket' }));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Test Ticket',
            description: 'This is a test ticket.',
            category: 'Bug',
            priority: 'HIGH',
            status: 'OPEN',
            assignedTo: null
        });
    });

    it('submits edited values in edit mode', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <TicketFormWizard
                mode="edit"
                initialValues={{
                    title: 'Existing ticket',
                    description: 'Loaded from the backend.',
                    category: 'Hardware',
                    status: 'IN_PROGRESS',
                    priority: 'MEDIUM',
                    assignedTo: 'agent@example.com'
                }}
                onSubmit={onSubmit}
            />
        );

        // Step 1 - the loaded values are shown, and we change the title
        expect(screen.getByLabelText('Title')).toHaveValue('Existing ticket');
        await user.clear(screen.getByLabelText('Title'));
        await user.type(screen.getByLabelText('Title'), 'Existing ticket updated');
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        // Step 2 - the loaded classification is kept
        expect(screen.getByLabelText('Status')).toHaveValue('IN_PROGRESS');
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        // Step 3 - edit mode shows "Update Ticket" instead of "Create Ticket"
        await user.click(screen.getByLabelText('I have reviewed the ticket details and they are ready to submit.'));
        await user.click(screen.getByRole('button', { name: 'Update Ticket' }));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Existing ticket updated',
            description: 'Loaded from the backend.',
            category: 'Hardware',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            assignedTo: 'agent@example.com'
        });
    });
});