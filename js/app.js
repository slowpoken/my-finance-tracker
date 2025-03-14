
// Запрос разрешения у пользователя
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      console.log('Разрешение на уведомления:', permission);
    });
  }
  

  function sendNotification(title, options) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.showNotification(title, options);
        }
      });
    }
  }
  
  // вызов уведомления:
  function notifyFinancialGoal() {
    sendNotification('Напоминание', {
      body: 'Не забудьте проверить ваши финансовые цели на сегодня!',
      icon: 'favicon.ico' 
    });
  }
  
  // Пример: вызов уведомления через 5 секунд для демонстрации
  setTimeout(notifyFinancialGoal, 5000);
  

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/sw.js')
        .then(registration => {
          console.log('ServiceWorker зарегистрирован: ', registration);
        })
        .catch(error => {
          console.error('Ошибка при регистрации ServiceWorker: ', error);
        });
    });
  }
  

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
        <button onclick="openEditModal(${entry.id})">Редактировать</button>
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

  function updateChart() {
    // Получите значения фильтров
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const selectedCategory = document.getElementById('categoryFilter').value;
  
    // Фильтрация записей по датам (если заданы) и категории
    let filteredEntries = entries;
    if (startDate) {
      filteredEntries = filteredEntries.filter(e => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredEntries = filteredEntries.filter(e => new Date(e.date) <= new Date(endDate));
    }
    if (selectedCategory !== 'all') {
      filteredEntries = filteredEntries.filter(e => e.category === selectedCategory);
    }
  
    //суммируем доходы и расходы по отфильтрованным данным
    let totalIncome = filteredEntries.filter(e => e.category === 'income')
                                     .reduce((sum, e) => sum + e.amount, 0);
    let totalExpense = filteredEntries.filter(e => e.category === 'expense')
                                      .reduce((sum, e) => sum + e.amount, 0);
    
    const data = {
      labels: ['Доход', 'Расход'],
      datasets: [{
        data: [totalIncome, totalExpense],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    };
  
    if (financeChart) {
      financeChart.data = data;
      financeChart.update();
    } else {
      financeChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
  
  // Обработчик для применения фильтров
  document.getElementById('applyFilters').addEventListener('click', updateChart);
  
  
  updateChart();

  function openEditModal(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
  
    document.getElementById('editId').value = entry.id;
    document.getElementById('editDescription').value = entry.description;
    document.getElementById('editAmount').value = entry.amount;
    document.getElementById('editCategory').value = entry.category;
  
    document.getElementById('editModal').style.display = 'block';
  }
  
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
  });
  
//Обработка отправку формы редактирования
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const id = parseInt(document.getElementById('editId').value);
    const updatedDescription = document.getElementById('editDescription').value;
    const updatedAmount = parseFloat(document.getElementById('editAmount').value);
    const updatedCategory = document.getElementById('editCategory').value;
  
    // Найти индекс записи в массиве и обновить данные
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index].description = updatedDescription;
      entries[index].amount = updatedAmount;
      entries[index].category = updatedCategory;
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
      updateChart();
    }
    
    document.getElementById('editModal').style.display = 'none';
  });
  