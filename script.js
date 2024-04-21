var add = document.getElementById('addToDo');
var input = document.getElementById('inputField');
var toDoContainer = document.getElementById('toDoContainer');

add.addEventListener('click', addItem);
input.addEventListener('keypress', function (e) {
    if (e.key == "Enter") {
        addItem();
    }
});

function loadToDoItemsFromLocalStorage() {
    // Lấy danh sách các mục công việc từ local storage
    const storedToDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

    // Kiểm tra xem có các mục công việc trong local storage hay không
    if (storedToDoList.length === 0) {
        console.log("Không tìm thấy mục công việc nào trong local storage.");
        return;
    }

    // Duyệt qua từng mục công việc và hiển thị chúng
    storedToDoList.forEach(item => {
        // Tạo các phần tử HTML cho mỗi mục công việc và thêm chúng vào DOM
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.itemId = item.id;

        // Tạo checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => {
            // Cập nhật trạng thái hoàn thành khi checkbox thay đổi
            updateToDoItem(item.id, item.text, checkbox.checked);
            if (checkbox.checked) {
                inputItem.style.textDecoration = "line-through";
            } else {
                inputItem.style.textDecoration = "none";
            }
        });
        newItem.appendChild(checkbox);

        const itemContent = document.createElement('div');
        itemContent.classList.add('content');
        const inputItem = document.createElement('input');
        inputItem.classList.add('text');
        inputItem.type = 'text';
        inputItem.value = item.text;
        inputItem.setAttribute('readonly', 'readonly');

        if (item.completed) {
            inputItem.style.textDecoration = "line-through";
        }


        itemContent.appendChild(inputItem);

        const itemAction = document.createElement('div');
        itemAction.classList.add('actions');
        const edit_item = document.createElement('button');
        edit_item.classList.add('edit', 'btn', 'btn-success');
        edit_item.type = "button";
        edit_item.innerText = 'Edit';
        const delete_Item = document.createElement('button');
        delete_Item.classList.add('delete', 'btn', 'btn-danger', 'fa', 'fa-trash');
        itemAction.appendChild(edit_item);
        itemAction.appendChild(delete_Item);

        newItem.appendChild(itemContent);
        newItem.appendChild(itemAction);
        toDoContainer.appendChild(newItem);

        // Di chuyển việc định nghĩa input_item vào trong vòng lặp
        const input_item = inputItem;

        edit_item.addEventListener('click', (e) => {
            if (edit_item.innerText.toLowerCase() == "edit") {
                edit_item.innerText = "Save";
                input_item.removeAttribute("readonly");
                input_item.focus();
            } else {
                const editedText = input_item.value;
                const itemId = input_item.parentElement.parentElement.dataset.itemId;
                const completed = checkbox.checked;

                updateToDoItem(itemId, editedText, completed);

                edit_item.innerText = "Edit";
                input_item.setAttribute("readonly", "readonly");
            }
        });

        delete_Item.addEventListener('click', (e) => {
            const item = e.target.closest('.item');
            toDoContainer.removeChild(item);
            let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
            toDoList = toDoList.filter(todo => todo.id !== item.dataset.itemId);
            localStorage.setItem('toDoList', JSON.stringify(toDoList));
        });
    });
}



document.addEventListener('DOMContentLoaded', function () {
    loadToDoItemsFromLocalStorage();
});


function addItem(e) {

    const item_value = input.value;

    if (item_value.trim() === '') {
        alert("Vui lòng nhập nội dung công việc!");
        return;
    }

    // Tạo một ID ngẫu nhiên cho mục công việc
    const id = Math.random().toString(36).substr(2, 9);

    // Tạo một mục công việc mới
    const newItem = {
        id: id,
        text: item_value,
        completed: false
    };

    

    // Lưu mục công việc mới vào local storage
    let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
    toDoList.push(newItem);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));

    location.reload();

    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.itemId = id;

    const item_content = document.createElement('div');
    item_content.classList.add('content');

    item.appendChild(item_content);

    // Thêm checkbox
    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.type = 'checkbox';
    checkbox.checked = false; // Mặc định chưa hoàn thành
    checkbox.addEventListener('change', () => {
        // Cập nhật trạng thái hoàn thành của mục công việc trong danh sách toDoList
        const updatedToDoList = toDoList.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: checkbox.checked
                };
            }
            return item;
        });
        localStorage.setItem('toDoList', JSON.stringify(updatedToDoList));
        const textElement = checkbox.closest('.item').querySelector('.text');

        if (checkbox.checked) {
            textElement.style.textDecoration = "line-through";
        } else {
            textElement.style.textDecoration = "none";
        }
    });
    item_content.appendChild(checkbox);

    const input_item = document.createElement('input');
    input_item.classList.add('text');
    input_item.type = 'text';
    input_item.value = item_value;
    input_item.setAttribute('readonly', 'readonly');
    input_item.addEventListener('dblclick', function () {
        input_item.style.textDecoration = "line-through";
    })
    item_content.appendChild(input_item);

    const item_action = document.createElement('div');
    item_action.classList.add('actions');

    const edit_item = document.createElement('button');
    edit_item.classList.add('edit', 'btn', 'btn-success');
    edit_item.type = "button";
    edit_item.innerText = 'Edit';

    const delete_item = document.createElement('button');
    delete_item.classList.add('delete', 'btn', 'btn-danger', 'fa', 'fa-trash');

    item_action.appendChild(edit_item);
    item_action.appendChild(delete_item);

    item.appendChild(item_action);

    toDoContainer.appendChild(item);

    input.value = '';
    edit_item.addEventListener('click', (e) => {
        if (edit_item.innerText.toLowerCase() == "edit") {
            edit_item.innerText = "Save";
            input_item.removeAttribute("readonly");
            input_item.focus();
        } else {
            const editedText = input_item.value;
            const itemId = item.dataset.itemId;
            const completed = checkbox.checked;

            updateToDoItem(itemId, editedText, completed);

            edit_item.innerText = "Edit";
            input_item.setAttribute("readonly", "readonly");
        }
    });

    delete_item.addEventListener('click', (e) => {

        const item = e.target.closest('.item');

        toDoContainer.removeChild(item);

        let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

        toDoList = toDoList.filter(todo => todo.id !== item.dataset.itemId);

        localStorage.setItem('toDoList', JSON.stringify(toDoList));
    });
}

function updateToDoItem(itemId, newText, newCompleted) {
    let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
    const itemToUpdate = toDoList.find(item => item.id === itemId);
    if (itemToUpdate) {
        itemToUpdate.text = newText;
        itemToUpdate.completed = newCompleted;

        localStorage.setItem('toDoList', JSON.stringify(toDoList));
    }
}

// Lấy phần tử "Show/Hide Done"
const showHideDoneButton = document.querySelector('.dropdown-item');


showHideDoneButton.addEventListener('click', function () {
    // Lấy danh sách các mục công việc từ local storage
    let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

    const isShowingDone = showHideDoneButton.textContent === 'Hide Done';

    const filteredList = toDoList.filter(item => {
        return isShowingDone ? !item.completed : true;
    });

    toDoContainer.innerHTML = '';

    // Hiển thị danh sách các mục đã lọc
    filteredList.forEach(item => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.itemId = item.id;

        // Tạo checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => {
            updateToDoItem(item.id, item.text, checkbox.checked);
            if (checkbox.checked) {
                inputItem.style.textDecoration = "line-through";
            } else {
                inputItem.style.textDecoration = "none";
            }
        });
        newItem.appendChild(checkbox);

        const itemContent = document.createElement('div');
        itemContent.classList.add('content');
        const inputItem = document.createElement('input');
        inputItem.classList.add('text');
        inputItem.type = 'text';
        inputItem.value = item.text;
        inputItem.setAttribute('readonly', 'readonly');

        if (item.completed) {
            inputItem.style.textDecoration = "line-through";
        }


        itemContent.appendChild(inputItem);

        const itemAction = document.createElement('div');
        itemAction.classList.add('actions');
        const edit_item = document.createElement('button');
        edit_item.classList.add('edit', 'btn', 'btn-success');
        edit_item.type = "button";
        edit_item.innerText = 'Edit';
        const delete_Item = document.createElement('button');
        delete_Item.classList.add('delete', 'btn', 'btn-danger', 'fa', 'fa-trash');
        itemAction.appendChild(edit_item);
        itemAction.appendChild(delete_Item);

        newItem.appendChild(itemContent);
        newItem.appendChild(itemAction);
        toDoContainer.appendChild(newItem);

        const input_item = inputItem;

        edit_item.addEventListener('click', (e) => {
            if (edit_item.innerText.toLowerCase() == "edit") {
                edit_item.innerText = "Save";
                input_item.removeAttribute("readonly");
                input_item.focus();
            } else {
                const editedText = input_item.value;
                const itemId = input_item.parentElement.parentElement.dataset.itemId;
                const completed = checkbox.checked;

                updateToDoItem(itemId, editedText, completed);

                edit_item.innerText = "Edit";
                input_item.setAttribute("readonly", "readonly");
            }
        });

        delete_Item.addEventListener('click', (e) => {
            const item = e.target.closest('.item');
            toDoContainer.removeChild(item);
            let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
            toDoList = toDoList.filter(todo => todo.id !== item.dataset.itemId);
            localStorage.setItem('toDoList', JSON.stringify(toDoList));
        });
    });

    showHideDoneButton.textContent = isShowingDone ? 'Show Done' : 'Hide Done';
});

window.onload = function () {
    var storedTitle = localStorage.getItem('todoListTitle');
    if (storedTitle) {
        document.getElementById('header-title').innerText = storedTitle;
    }
};

var headerTitle = document.getElementById('header-title');

headerTitle.addEventListener('click', function () {
    var newTitle = prompt("Nhập nội dung mới:");

    if (newTitle !== null && newTitle !== "") {
        headerTitle.innerText = newTitle;
        localStorage.setItem('todoListTitle', newTitle);
    }
});
