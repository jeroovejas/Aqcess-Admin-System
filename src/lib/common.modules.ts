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

export const downloadBase64Image = (base64String: string, fileName: string = 'downloaded-image') => {
    try {
        setTimeout(() => {
            const [mimeType, base64Data] = base64String.split(',');
            const type = mimeType.split(':')[1]?.split(';')[0] || 'image/png';
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);

                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                byteArrays.push(new Uint8Array(byteNumbers));
            }
            const byteArray = new Uint8Array(
                byteArrays.reduce((acc: number[], arr) => acc.concat(Array.from(arr)), [])
            );
            const newBlob = new Blob([byteArray], { type });
            const url = window.URL.createObjectURL(newBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 0); 
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
};


