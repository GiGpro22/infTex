const EventController = {
    events: [],
    
    init() {
        this.loadFromStorage();
        this.setupEventHandlers();
        this.updateDisplay();
    },

    // загр дан
    loadFromStorage() {
        const stored = localStorage.getItem('eventData');
        this.events = stored ? JSON.parse(stored) : [];
    },

    saveToStorage() {
        localStorage.setItem('eventData', JSON.stringify(this.events));
    },

    createEvent(data) {
        const event = {
            id: Date.now().toString(),
            title: data.title,
            date: data.date,
            category: data.category,
            description: data.description,
            createdAt: new Date().toISOString()
        };
        this.events.push(event);
        this.saveToStorage();
        this.updateDisplay();
    },

    // обнов соб
    modifyEvent(id, newData) {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events[index] = {
                ...this.events[index],
                ...newData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            this.updateDisplay();
        }
    },

    // удал
    removeEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveToStorage();
        this.updateDisplay();
    },

    filterEvents(category) {
        return category === 'all' 
            ? this.events 
            : this.events.filter(e => e.category === category);
    },

 
    sortEvents(events, order) {
        return [...events].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
    },

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    },

    getCategoryLabel(category) {
        const labels = {
            'personal': 'Личные',
            'work': 'Рабочие',
            'social': 'Общественные'
        };
        return labels[category] || category;
    },

    // Создание карточки события
    createEventElement(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = event.id;

        card.innerHTML = `
            <h3>${event.title}</h3>
            <div class="date">${this.formatDate(event.date)}</div>
            <div class="category">${this.getCategoryLabel(event.category)}</div>
            <p>${event.description || 'Описание отсутствует'}</p>
        `;

        card.addEventListener('click', () => {
            window.location.href = `redact.html?id=${event.id}`;
        });

        return card;
    },

    updateDisplay() {
        const container = document.getElementById('eventsContainer');
        if (!container) return;

        const category = document.getElementById('categoryFilter')?.value || 'all';
        const sortOrder = document.getElementById('dateSort')?.value || 'newest';

        let events = this.filterEvents(category);
        events = this.sortEvents(events, sortOrder);

        container.innerHTML = '';
        events.forEach(event => {
            container.appendChild(this.createEventElement(event));
        });
    },

    setupEventHandlers() {
        const addBtn = document.getElementById('addEventBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                window.location.href = 'dobav.html';
            });
        }

        // фильтрация
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.updateDisplay());
        }

        // сорт
        const dateSort = document.getElementById('dateSort');
        if (dateSort) {
            dateSort.addEventListener('change', () => this.updateDisplay());
        }

        const addForm = document.getElementById('addEventForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createEvent({
                    title: document.getElementById('eventTitle').value,
                    date: document.getElementById('eventDate').value,
                    category: document.getElementById('eventCategory').value,
                    description: document.getElementById('eventDescription').value
                });
                window.location.href = 'index.html';
            });
        }

        // рудактирование
        const editForm = document.getElementById('editEventForm');
        if (editForm) {
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('id');
            
            if (eventId) {
                const event = this.events.find(e => e.id === eventId);
                
                if (event) {
                    document.getElementById('editEventTitle').value = event.title;
                    document.getElementById('editEventDate').value = event.date;
                    document.getElementById('editEventCategory').value = event.category;
                    document.getElementById('editEventDescription').value = event.description || '';

                    editForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.modifyEvent(eventId, {
                            title: document.getElementById('editEventTitle').value,
                            date: document.getElementById('editEventDate').value,
                            category: document.getElementById('editEventCategory').value,
                            description: document.getElementById('editEventDescription').value
                        });
                        window.location.href = 'index.html';
                    });

                    const deleteBtn = document.getElementById('deleteEventBtn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', () => {
                            if (confirm('Вы уверены, что хотите удалить это событие?')) {
                                this.removeEvent(eventId);
                                window.location.href = 'index.html';
                            }
                        });
                    }
                } else {
                    window.location.href = 'index.html';
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    EventController.init();
}); 