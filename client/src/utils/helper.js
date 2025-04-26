import moment from "moment";

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  let initials = '';
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i][0].toUpperCase();
    }
  }
  return initials;
}

export const addThousandsSeperator = (num) => {
  if (num === null || isNaN(num)) return '';
 const [integerPart, fractionalPart] = num.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }))

  return chartData
}

// export const prepareIncomeBarChartData = (data = []) => {
//   const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

//   const chartData = sortedData.map((item) => ({
//     month: moment(item?.date).format("Do MMM"),
//     amount: item?.amount,
//     source: item?.source
//   }))

//   return chartData
// }

export const prepareIncomeBarChartData = (data = []) => {
  console.log("Preparing income chart data from:", data);
  
  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is empty or not an array");
    return [];
  }

  // Need to make sure we're only processing income transactions
  const incomeTransactions = data.filter(item => item.type === 'income' || item.source);
  console.log("Filtered income transactions:", incomeTransactions);
  
  if (incomeTransactions.length === 0) {
    console.log("No income transactions found");
    return [];
  }

  const sortedData = [...incomeTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const chartData = sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item.amount,
    source: item.source
  }));
  
  console.log("Final chart data:", chartData);
  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  console.log("Preparing income chart data from:", data);
  
  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is empty or not an array");
    return [];
  }

  // Need to make sure we're only processing income transactions
  const expenseTransactions = data.filter(item => item.type === 'expense' || item.category);
  console.log("Filtered expense transactions:", expenseTransactions);
  
  if (expenseTransactions.length === 0) {
    console.log("No expense transactions found");
    return [];
  }

  const sortedData = [...expenseTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const chartData = sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item.amount,
    category: item.category
  }));
  
  console.log("Final chart data:", chartData);
  return chartData;
}

// utils/formatters.js

/**
//  * Formats a number as currency with the specified locale and currency code
//  * @param {number|string} value - The numeric value to format
//  * @param {string} locale - The locale to use (default: 'en-US')
//  * @param {string} currencyCode - The currency code to use (default: 'USD')
//  * @returns {string} - Formatted currency string
//  */
// export const formatCurrency = (value, locale = 'en-US', currencyCode = 'USD') => {
//   // Handle null, undefined, or empty string
//   if (value === null || value === undefined || value === '') {
//     return '$0.00';
//   }

//   // Convert to number if it's a string
//   const numericValue = typeof value === 'string' ? parseFloat(value) : value;

//   // Check if it's a valid number
//   if (isNaN(numericValue)) {
//     return '$0.00';
//   }

//   try {
//     // Use Intl.NumberFormat for localized currency formatting
//     return new Intl.NumberFormat(locale, {
//       style: 'currency',
//       currency: currencyCode,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(numericValue);
//   } catch (error) {
//     console.error('Error formatting currency:', error);
//     // Fallback formatting
//     return `$${numericValue.toFixed(2)}`;
//   }
// };

/**
 * Formats a number as currency in Indian Rupees (₹)
 * @param {number|string} value - The numeric value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return '₹0.00';
  }

  // Convert to number if it's a string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(numericValue)) {
    return '₹0.00';
  }

  try {
    // Always use Indian Rupee formatting
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback formatting
    return `₹${numericValue.toFixed(2)}`;
  }
};


/**
 * Formats a percentage value
 * @param {number|string} value - The numeric value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted percentage string with % symbol
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0%';
  }

  return `${numericValue.toFixed(decimals)}%`;
};

/**
 * Formats a date in a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - Format style (default: 'medium')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const options = {
      short: { month: 'numeric', day: 'numeric', year: '2-digit' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
    };
    
    return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Formats a number with thousands separators
 * @param {number|string} value - The numeric value to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted number with thousands separators
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numericValue);
};