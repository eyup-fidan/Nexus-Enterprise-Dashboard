// --- STATE MANAGEMENT: CUSTOMERS ---
const defaultCustomers = [
    { id: 1, firstName: 'Ayşe', lastName: 'Soylu', email: 'ayse@example.com', role: 'Project Manager', status: 'Active', joined: '2023-12-01' },
    { id: 2, firstName: 'Mustafa', lastName: 'Kaya', email: 'mustafa@example.com', role: 'Developer', status: 'Pending', joined: '2023-11-15' },
    { id: 3, firstName: 'Burak', lastName: 'Er', email: 'burak@example.com', role: 'Designer', status: 'Inactive', joined: '2023-10-20' },
    { id: 4, firstName: 'Zeynep', lastName: 'Yılmaz', email: 'zeynep@example.com', role: 'Developer', status: 'Active', joined: '2023-12-05' },
    { id: 5, firstName: 'Ahmet', lastName: 'Demir', email: 'ahmet@example.com', role: 'New User', status: 'Active', joined: '2023-12-10' },
    { id: 6, firstName: 'Mehmet', lastName: 'Çelik', email: 'mehmet@example.com', role: 'Project Manager', status: 'Pending', joined: '2023-11-25' },
    { id: 7, firstName: 'Elif', lastName: 'Koç', email: 'elif@example.com', role: 'Designer', status: 'Active', joined: '2023-10-30' },
    { id: 8, firstName: 'Can', lastName: 'Öztürk', email: 'can@example.com', role: 'Developer', status: 'Inactive', joined: '2023-09-15' },
    { id: 9, firstName: 'Selin', lastName: 'Arslan', email: 'selin@example.com', role: 'New User', status: 'Active', joined: '2023-12-20' },
    { id: 10, firstName: 'Deniz', lastName: 'Kara', email: 'deniz@example.com', role: 'Developer', status: 'Active', joined: '2023-12-22' },
    { id: 11, firstName: 'Ozan', lastName: 'Kurt', email: 'ozan@example.com', role: 'Designer', status: 'Pending', joined: '2023-11-05' },
    { id: 12, firstName: 'Gizem', lastName: 'Aydın', email: 'gizem@example.com', role: 'Project Manager', status: 'Active', joined: '2023-10-10' }
];

let customers = JSON.parse(localStorage.getItem('nexusCustomers')) || defaultCustomers;

// Pagination Variables
let currentPage = 1;
const rowsPerPage = 10;

function saveCustomers() {
    localStorage.setItem('nexusCustomers', JSON.stringify(customers));
    renderCustomers();
    updateDashboardStats();
}

// --- STATE MANAGEMENT: TASKS (KANBAN) ---
const defaultTasks = [
    { id: 'task-1', title: 'Homepage Redesign', tag: 'design', date: '2023-12-28', status: 'todo' },
    { id: 'task-2', title: 'API Integration', tag: 'dev', date: '2023-12-30', status: 'todo' },
    { id: 'task-3', title: 'Dashboard Dark Mode', tag: 'dev', date: '2023-12-24', status: 'progress' },
    { id: 'task-4', title: 'Icon Set Selection', tag: 'design', date: '2023-12-20', status: 'done' }
];

let tasks = JSON.parse(localStorage.getItem('nexusTasks')) || defaultTasks;

function saveTasks() {
    localStorage.setItem('nexusTasks', JSON.stringify(tasks));
    renderKanban();
}

// --- DOM ELEMENTS ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const customersTableBody = document.querySelector('#customers-table tbody');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Modal Elements
const modalCustomer = document.getElementById('modal-add-customer');
const openModalCustomerBtn = document.getElementById('btn-add-customer');
const addCustomerForm = document.getElementById('add-customer-form');
const modalCustomerTitle = document.getElementById('modal-title');
const modalCustomerSubmitBtn = document.getElementById('modal-submit-btn');

const modalTask = document.getElementById('modal-add-task');
const openModalTaskBtn = document.getElementById('btn-add-task');
const addTaskForm = document.getElementById('add-task-form');

const closeModalElements = document.querySelectorAll('.modal-close, .modal-close-btn');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
    renderCustomers();
    renderKanban();
    updateDashboardStats();
});

// --- HELPER: UPDATE DASHBOARD STATS ---
function updateDashboardStats() {
    const activeUsersEl = document.getElementById('stat-active-users');
    if (activeUsersEl) {
        activeUsersEl.textContent = customers.length.toLocaleString();
    }
}

// --- RENDER CUSTOMERS (WITH PAGINATION) ---
function renderCustomers(data = customers) {
    if (!customersTableBody) return;
    customersTableBody.innerHTML = '';
    
    // Pagination Logic
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(customer => {
        const initials = (customer.firstName[0] + customer.lastName[0]).toUpperCase();
        const fullName = `${customer.firstName} ${customer.lastName}`;
        
        const colors = [
            { bg: '#E0F2FE', text: '#0284C7' }, { bg: '#F3E8FF', text: '#7E22CE' },
            { bg: '#FEE2E2', text: '#DC2626' }, { bg: '#DCFCE7', text: '#166534' },
            { bg: '#FEF3C7', text: '#D97706' }
        ];
        const color = colors[fullName.length % colors.length];

        let badgeClass = 'badge--success';
        if (customer.status === 'Pending') badgeClass = 'badge--warning';
        if (customer.status === 'Inactive') badgeClass = 'badge--danger';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-initials" style="background: ${color.bg}; color: ${color.text}">${initials}</div>
                    <div class="user-details-table">
                        <span class="customer-name">${fullName}</span>
                        <span class="customer-email-sub">${customer.email}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge ${badgeClass}"><span class="dot"></span>${customer.status}</span></td>
            <td>${customer.joined || 'Just now'}</td>
            <td>
                <div class="action-wrapper">
                    <button class="action-btn" onclick="toggleActionMenu(this)"><i class="fa-solid fa-ellipsis"></i></button>
                    <div class="action-menu">
                        <a href="#" class="action-item" onclick="openEditModal(${customer.id})"><i class="fa-regular fa-pen-to-square"></i> Edit</a>
                        <a href="#" class="action-item text-danger" onclick="deleteCustomer(${customer.id})"><i class="fa-regular fa-trash-can"></i> Delete</a>
                    </div>
                </div>
            </td>
        `;
        customersTableBody.appendChild(row);
    });
    
    // Update Pagination Controls
    setupPagination(data, document.querySelector('.pagination-buttons'), rowsPerPage);
    
    // Update Info Text (Showing 1-10 of 50)
    const info = document.getElementById('pagination-info');
    if(info) {
        if(data.length === 0) {
            info.innerHTML = "No customers found";
        } else {
            info.innerHTML = `Showing <strong>${start + 1}-${Math.min(end, data.length)}</strong> of <strong>${data.length}</strong> customers`;
        }
    }
}

// --- SETUP PAGINATION CONTROLS ---
function setupPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = "";
    const pageCount = Math.ceil(items.length / rowsPerPage);
    
    if (pageCount === 0) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Previous';
    if (currentPage === 1) prevBtn.disabled = true;
    prevBtn.addEventListener('click', () => {
        currentPage--;
        renderCustomers(items);
    });
    wrapper.appendChild(prevBtn);

    // Page Number Buttons
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        if (currentPage === i) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderCustomers(items);
        });
        wrapper.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    if (currentPage === pageCount) nextBtn.disabled = true;
    nextBtn.addEventListener('click', () => {
        currentPage++;
        renderCustomers(items);
    });
    wrapper.appendChild(nextBtn);
}

// --- RENDER KANBAN (DYNAMIC) ---
function renderKanban() {
    const todoContainer = document.getElementById('kanban-todo');
    const progressContainer = document.getElementById('kanban-progress');
    const doneContainer = document.getElementById('kanban-done');
    
    if(todoContainer) todoContainer.innerHTML = '';
    if(progressContainer) progressContainer.innerHTML = '';
    if(doneContainer) doneContainer.innerHTML = '';

    let counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach(task => {
        counts[task.status]++;
        
        let tagClass = 'tag--dev';
        if(task.tag === 'design') tagClass = 'tag--design';
        if(task.tag === 'marketing') tagClass = 'tag--marketing';

        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.id = task.id;
        card.setAttribute('ondragstart', 'drag(event)');
        
        const dateObj = new Date(task.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        card.innerHTML = `
            <button class="task-delete-btn" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-times"></i></button>
            <div class="card-tags"><span class="tag ${tagClass}">${task.tag}</span></div>
            <h4 class="card-title">${task.title}</h4>
            <div class="card-meta">
                <div class="card-users"><div class="user-initials sm" style="background: #E2E8F0; color: #64748B"><i class="fa-solid fa-user"></i></div></div>
                <div class="card-date"><i class="fa-regular fa-clock"></i> ${dateStr}</div>
            </div>
        `;

        if (task.status === 'todo') todoContainer.appendChild(card);
        else if (task.status === 'progress') progressContainer.appendChild(card);
        else if (task.status === 'done') doneContainer.appendChild(card);
    });

    document.getElementById('count-todo').textContent = counts.todo;
    document.getElementById('count-progress').textContent = counts.progress;
    document.getElementById('count-done').textContent = counts.done;
}

// --- KANBAN DRAG & DROP LOGIC ---
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const targetColumn = ev.target.closest('.kanban-items');
    
    if (targetColumn) {
        const newStatus = targetColumn.getAttribute('data-status');
        const taskIndex = tasks.findIndex(t => t.id === data);
        if (taskIndex > -1 && tasks[taskIndex].status !== newStatus) {
            tasks[taskIndex].status = newStatus;
            saveTasks();
            showToast(`Task moved to ${newStatus.toUpperCase()}`, 'success');
        }
    }
}

// --- ADD TASK LOGIC ---
if (openModalTaskBtn) {
    openModalTaskBtn.addEventListener('click', () => {
        addTaskForm.reset();
        modalTask.classList.add('modal-open');
    });
}

if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const tag = document.getElementById('task-tag').value;
        const date = document.getElementById('task-date').value;

        const newTask = {
            id: 'task-' + Date.now(),
            title, tag, date, status: 'todo'
        };

        tasks.push(newTask);
        saveTasks();
        modalTask.classList.remove('modal-open');
        showToast('New task created!', 'success');
        addNotification(`New task created: ${title}`);
    });
}

window.deleteTask = function(id) {
    if(confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        showToast('Task deleted', 'error');
    }
}

// --- CUSTOMER CRUD ---
if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('customer-id').value;
        const firstName = document.getElementById('customer-name').value;
        const lastName = document.getElementById('customer-surname').value;
        const email = document.getElementById('customer-email').value;
        const role = document.getElementById('customer-role').value;
        const status = document.getElementById('customer-status').value;
        const fullName = `${firstName} ${lastName}`;

        if (id) {
            const index = customers.findIndex(c => c.id == id);
            if (index > -1) {
                customers[index] = { ...customers[index], firstName, lastName, email, role, status };
                showToast(`Customer updated successfully!`, 'success');
                addNotification(`Updated customer: ${fullName}`);
            }
        } else {
            const newCustomer = {
                id: Date.now(),
                firstName, lastName, email, role, status,
                joined: new Date().toISOString().split('T')[0]
            };
            customers.unshift(newCustomer);
            showToast(`New customer added!`, 'success');
            addNotification(`New customer added: ${fullName}`);
        }
        saveCustomers();
        modalCustomer.classList.remove('modal-open');
    });
}

window.deleteCustomer = function(id) {
    if (confirm('Delete this customer?')) {
        customers = customers.filter(c => c.id !== id);
        saveCustomers();
        showToast('Customer deleted.', 'error');
        addNotification('A customer was deleted');
    }
}

window.openEditModal = function(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    document.getElementById('customer-id').value = customer.id;
    document.getElementById('customer-name').value = customer.firstName;
    document.getElementById('customer-surname').value = customer.lastName;
    document.getElementById('customer-email').value = customer.email;
    document.getElementById('customer-role').value = customer.role || 'New User';
    document.getElementById('customer-status').value = customer.status;
    modalCustomerTitle.textContent = 'Edit Customer';
    modalCustomerSubmitBtn.textContent = 'Update Changes';
    modalCustomer.classList.add('modal-open');
}

// --- MODAL UTILS ---
if (openModalCustomerBtn) {
    openModalCustomerBtn.addEventListener('click', () => {
        addCustomerForm.reset();
        document.getElementById('customer-id').value = '';
        modalCustomerTitle.textContent = 'Add New Customer';
        modalCustomerSubmitBtn.textContent = 'Add Customer';
        modalCustomer.classList.add('modal-open');
    });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('modal-open'));
}
closeModalElements.forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(); });

// --- SEARCH & SORT ---
const searchInput = document.getElementById('table-search');
const sortSelect = document.getElementById('sort-select');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = customers.filter(c => 
            c.firstName.toLowerCase().includes(term) || 
            c.lastName.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term)
        );
        currentPage = 1; // Arama yapınca 1. sayfaya dön
        renderCustomers(filtered);
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const type = e.target.value;
        let sorted = [...customers];
        if (type === 'newest') sorted.sort((a, b) => new Date(b.joined) - new Date(a.joined));
        if (type === 'oldest') sorted.sort((a, b) => new Date(a.joined) - new Date(b.joined));
        if (type === 'az') sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
        if (type === 'za') sorted.sort((a, b) => b.firstName.localeCompare(a.firstName));
        currentPage = 1; // Sıralama değişince 1. sayfaya dön
        renderCustomers(sorted);
    });
}

// --- UI UTILITIES ---
window.toggleActionMenu = function(btn) {
    const menu = btn.nextElementSibling;
    document.querySelectorAll('.action-menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); });
    menu.classList.toggle('show');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.innerHTML = isDark ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
});

document.querySelectorAll('.sidebar__link[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
        link.classList.add('sidebar__link--active');
        const target = link.getAttribute('data-target');
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('view--active');
            if (v.id === target) v.classList.add('view--active');
        });
        if (window.innerWidth <= 1024) sidebar.classList.remove('sidebar-open');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-wrapper')) {
        document.querySelectorAll('.action-menu.show').forEach(m => m.classList.remove('show'));
    }
    const profileWrap = document.querySelector('.user-profile-wrapper');
    if (profileWrap && !profileWrap.contains(e.target)) {
        document.getElementById('profile-dropdown')?.classList.remove('show');
    }
    const notifWrap = document.querySelector('.notification-wrapper');
    if (notifWrap && !notifWrap.contains(e.target)) {
        document.getElementById('notification-dropdown')?.classList.remove('show');
    }
});

const profileBtn = document.getElementById('user-profile-btn');
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('profile-dropdown').classList.toggle('show');
    });
}

// --- NOTIFICATION SYSTEM ---
const notifBtn = document.getElementById('notification-btn');
const notifDropdown = document.getElementById('notification-dropdown');
const notifList = document.getElementById('notification-list');
const notifBadge = document.getElementById('notification-badge');
let notifCount = 0;

if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
    });
}

function addNotification(message) {
    const emptyMsg = notifList.querySelector('.empty-notif');
    if (emptyMsg) emptyMsg.remove();

    const notifItem = document.createElement('div');
    notifItem.className = 'notif-item';
    notifItem.innerHTML = `
        <div class="notif-icon"><i class="fa-solid fa-info"></i></div>
        <div class="notif-content">
            <p>${message}</p>
            <span>Just now</span>
        </div>
    `;
    notifList.prepend(notifItem);
    
    notifCount++;
    notifBadge.style.display = 'flex';
    notifBadge.textContent = notifCount;
}

document.getElementById('clear-notifications')?.addEventListener('click', (e) => {
    e.preventDefault();
    notifCount = 0;
    notifBadge.style.display = 'none';
    notifList.innerHTML = '<div class="empty-notif">No new notifications</div>';
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// --- MOBILE SIDEBAR LOGIC ---
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('sidebar-open');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        sidebarOverlay.classList.remove('active');
    });
}

// Menü linklerine tıklayınca mobilde menüyü kapat
document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('sidebar-open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    });
});