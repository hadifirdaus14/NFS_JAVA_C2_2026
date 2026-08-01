// Shows a small error under a single form field. Renders nothing if no message.
export default function InlineFieldError({ message }) {
    if (!message) {
        return null;
    }
    return <span className="field-error">{message}</span>;
}
