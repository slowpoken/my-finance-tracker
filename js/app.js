let entries = JSON.parse(localStorage.getItem('entries')) || [];
const financeForm = document.getElementById('financeForm');
const entriesList = document.getElementById('entriesList');
const ctx = document.getElementById('financeChart').getContext('2d');
let financeChart;
