let entries = JSON.parse(localStorage.getItem('entries')) || [];
const financeForm = document.getElementById('financeForm');
const entriesList = document.getElementById('entriesList');
const ctx = document.getElementById('financeChart').getContext('2d');
let financeChart;

financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    if(description && !isNaN(amount) && category) {
      const entry = {
        id: Date.now(),
        description,
        amount,
        category,
        date: new Date().toLocaleDateString()
      };
      
      entries.push(entry);
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
      updateChart();
      
      financeForm.reset();
    }
  });
  