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
  
  function renderEntries() {
    entriesList.innerHTML = '';
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${entry.description}</strong> - ${entry.amount} руб. (${entry.category}) <em>${entry.date}</em>
        <button onclick="deleteEntry(${entry.id})">Удалить</button>
      `;
      entriesList.appendChild(li);
    });
  }
  
  function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
    updateChart();
  }
  
  // Первоначальное отображение при загрузке страницы
  renderEntries();
  