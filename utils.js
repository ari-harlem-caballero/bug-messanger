export function formatDate(dateString) {
    const dateOptions = { hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    return formattedDate;
}