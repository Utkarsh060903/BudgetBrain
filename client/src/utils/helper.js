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