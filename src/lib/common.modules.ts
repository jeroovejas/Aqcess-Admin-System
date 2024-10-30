import moment from 'moment';

export const toTitleCase = (value: any) => {
    return value.toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const parseDefaultDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    // const [hours, minutes] = timePart.split(':').map(Number); // Parse hours and minutes
    return `${year}-${month}-${day} ${timePart}`;
};