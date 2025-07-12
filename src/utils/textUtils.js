/**
 * Utility functions for text manipulation
 */

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 100)
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Formats currency in Vietnamese Dong
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

/**
 * Formats date in Vietnamese locale
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
};

/**
 * Capitalizes the first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
    if (!text) return '';
    return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Removes HTML tags from text
 * @param {string} text - The text to clean
 * @returns {string} - Clean text without HTML tags
 */
export const stripHtmlTags = (text) => {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '');
}; 