// Model - отвечает за данные и их управление
const model = {
    notes: [], 
    colors: {
        GREEN: 'green',
        BLUE: 'blue',
        RED: 'red',
        YELLOW: 'yellow',
        PURPLE: 'purple',
    },

    addNote(note, description, color) {
        const id = Math.random(); 
        const newNote = {
            id,
            note,
            description,
            color,
            isFavorite: false,
        };
        this.notes.unshift(newNote); 
    },

    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId); 
        view.renderNotes(this.notes); 
    },

    toggleFavorite(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        if (note) {
            note.isFavorite = !note.isFavorite;
        }
    }
};

const view = {
    init() {
        this.renderNotes(model.notes);
        const form = document.querySelector('.form');
        const noteTitle = document.querySelector('.note-title');
        const noteDescription = document.querySelector('.note-description');
        const showFavoritesCheckbox = document.getElementById('show-favorites');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const note = noteTitle.value;
            const description = noteDescription.value;
            const color = document.querySelector('input[name=color]:checked').value; // Получаем выбранный цвет

            if (note.length <= 50) { 
                controller.addNote(note, description, color);
                noteTitle.value = ''; 
                noteDescription.value = ''; 
            } else {
                this.displayMessage('Максимальная длина заголовка - 50 символов');
            }
        });

        const notesList = document.querySelector('.list');
        notesList.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                const noteId = +event.target.closest('.example-note').id; 
                console.log('Delete button clicked for note ID:', noteId);
                controller.deleteNote(noteId);
            } else if (event.target.classList.contains('favorite-button')) {
                const noteId = +event.target.closest('.example-note').id; 
                console.log('Favorite button clicked for note ID:', noteId);
                controller.toggleFavorite(noteId);
            }
        });

        showFavoritesCheckbox.addEventListener('change', () => {
            const filteredNotes = showFavoritesCheckbox.checked ? model.notes.filter(note => note.isFavorite) : model.notes;
            this.renderNotes(filteredNotes);
        });
    },

    renderNotes(notes) {
        const list = document.querySelector('.list');
        list.innerHTML = ''; // Очищаем список перед перерисовкой

        if (notes.length === 0) {
            list.innerHTML = `
                <p id="no-notes">У вас нет еще ни одной заметки.<br/>Заполните поля выше и создайте свою первую заметку!</p>
            `;
        } else {
            for (const note of notes) {
                const favoriteIcon = note.isFavorite ? './images/icons/heart-active.svg' : './images/icons/heart-inactive.svg';
                const noteElement = document.createElement('li');
                noteElement.className = 'notes-list';
                noteElement.innerHTML = `
                    <div class="example-note" id="${note.id}" style="background-color: ${this.getColor(note.color)};">
                        <div class="new-name">
                            <p class="note">${note.note}</p>
                            <div class="note-buttons">
                                <button class="favorite-button" style="background-color: ${this.getColor(note.color)};">
                                    <img src="${favoriteIcon}" alt="иконка избранного" style="width: 16px; height: 16px;">
                                </button>
                                <button class="delete-button" style="background-color: ${this.getColor(note.color)};">
                                    <img src="./images/icons/trash.svg" alt="иконка удаления" style="width: 16px; height: 16px;">
                                </button>
                            </div>
                        </div>
                        <div class="description-wrapper">
                            <p class="description">${note.description}</p>
                        </div>
                    </div>
                `;
                list.appendChild(noteElement);
            }
        }

        this.updateNoteCounter(); 
        this.updateFilterCheckbox();
    },

    getColor(color) {
        switch (color) {
            case 'red':
                return '#F37D7D';
            case 'green':
                return '#C2F37D';
            case 'blue':
                return '#7DE1F3';
            case 'yellow':
                return '#F3DB7D';
            case 'purple':
                return '#E77DF3';
            default:
                return '#FFFFFF'; // Default color if none is selected
        }
    },

    updateNoteCounter() {
        const timer = document.getElementById('timer');
        timer.textContent = `${model.notes.length}`; 
    },

    updateFilterCheckbox() {
        const showFavoritesCheckbox = document.getElementById('show-favorites');
        const hasFavoriteNotes = model.notes.some(note => note.isFavorite);
        showFavoritesCheckbox.style.display = hasFavoriteNotes ? 'block' : 'none';
    },

    displayMessage(message) {
        const messagesBox = document.querySelector('.messages-box');
        messagesBox.textContent = message;

        setTimeout(() => {
            messagesBox.textContent = '';
        }, 3000);
    }
};

const controller = {
    addNote(note, description, color) {
        model.addNote(note, description, color);
        view.displayMessage('Заметка добавлена!'); // Сообщение об успешном добавлении
        view.renderNotes(model.notes); // Обновляем отображение заметок
    },

    deleteNote(id) {
        console.log('Deleting note with ID:', id);
        model.deleteNote(id);
        view.updateNoteCounter(); // Обновляем счетчик после удаления заметки
    },

    toggleFavorite(id) {
        console.log('Toggling favorite for note with ID:', id);
        model.toggleFavorite(id);
        view.renderNotes(model.notes); // Обновляем отображение заметок
    }
};

// Инициализация приложения
function init() {
    view.init();
}

document.addEventListener('DOMContentLoaded', init);