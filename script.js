// --- AUTHENTICATION LOGIC ---
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const authForm = document.getElementById('auth-form');
const authToggleLink = document.getElementById('auth-toggle-link');
const authToggleText = document.getElementById('auth-toggle-text');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const signupFields = document.querySelectorAll('.signup-only');

let isLoginMode = true;

// Check Login State on Load
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showApp();
    } else {
        showAuth();
    }
    
    // Init Themes & Data
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
    renderCustomers();
    renderKanban();
    updateDashboardStats();
    loadUserProfile();
});

// Toggle Login/Signup
if(authToggleLink) {
    authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Enter your credentials to access your account.';
            authSubmitBtn.textContent = 'Sign In';
            authToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-toggle-link">Sign up</a>';
            signupFields.forEach(el => el.style.display = 'none');
        } else {
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Get started with Nexus Dashboard today.';
            authSubmitBtn.textContent = 'Sign Up';
            authToggleText.innerHTML = 'Already have an account? <a href="#" id="auth-toggle-link">Sign in</a>';
            signupFields.forEach(el => el.style.display = 'block');
        }
        document.getElementById('auth-toggle-link').addEventListener('click', arguments.callee);
    });
}

// Handle Auth Submit
if(authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value;

        if (!validateEmail(email)) {
            showToast('Please enter a valid email.', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        if (!isLoginMode && name.trim().length < 3) {
            showToast('Please enter a valid name.', 'error');
            return;
        }

        // Simulate API Call
        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            const userProfile = {
                name: isLoginMode ? 'Eyup Fidan' : name,
                email: email,
                phone: '+905551234567'
            };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            
            showToast(isLoginMode ? 'Welcome back!' : 'Account created successfully!');
            showApp();
            loadUserProfile();
        }, 800);
    });
}

function showApp() {
    authContainer.style.display = 'none';
    mainApp.style.display = 'grid';
}

function showAuth() {
    authContainer.style.display = 'flex';
    mainApp.style.display = 'none';
}

// Logout Logic
document.getElementById('nav-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    if(confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        showAuth();
        document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
        document.getElementById('view-dashboard').classList.add('view--active');
    }
});

// --- SETTINGS NAVIGATION LOGIC ---
const settingsNavItems = document.querySelectorAll('.settings-nav-item[data-tab]');
const settingsContents = document.querySelectorAll('.settings-tab-content');

settingsNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        settingsNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        settingsContents.forEach(content => content.classList.remove('active'));
        const targetId = `tab-${item.getAttribute('data-tab')}`;
        document.getElementById(targetId).classList.add('active');
    });
});

// Header Dropdown Navigation
document.getElementById('nav-my-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    openSettingsTab('general');
});
document.getElementById('nav-account-settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    openSettingsTab('security');
});

function openSettingsTab(tabName) {
    document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
    document.querySelector('.sidebar__link[data-target="view-settings"]').classList.add('sidebar__link--active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
    document.getElementById('view-settings').classList.add('view--active');
    settingsNavItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.settings-nav-item[data-tab="${tabName}"]`).classList.add('active');
    settingsContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// --- FORM VALIDATION LOGIC ---
const generalSettingsForm = document.getElementById('general-settings-form');
const saveGeneralBtn = document.getElementById('save-general-btn');

const inputs = {
    fname: document.getElementById('set-fname'),
    lname: document.getElementById('set-lname'),
    email: document.getElementById('set-email'),
    phone: document.getElementById('set-phone')
};

const rules = {
    name: /^[a-zA-Z\s]{2,20}$/, 
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+90[0-9]{10}$/ 
};

function validateInput(input, rule, errorMsg) {
    if(!input) return true;
    const value = input.value.trim();
    const errorSpan = input.nextElementSibling; 
    
    if (!rule.test(value)) {
        input.classList.add('error');
        if(errorSpan) errorSpan.textContent = errorMsg;
        return false;
    } else {
        input.classList.remove('error');
        if(errorSpan) errorSpan.textContent = '';
        return true;
    }
}

saveGeneralBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const isFnameValid = validateInput(inputs.fname, rules.name, 'Only letters allowed (2-20 chars)');
    const isLnameValid = validateInput(inputs.lname, rules.name, 'Only letters allowed (2-20 chars)');
    const isEmailValid = validateInput(inputs.email, rules.email, 'Invalid email format');
    const isPhoneValid = validateInput(inputs.phone, rules.phone, 'Format: +905551234567');

    if (isFnameValid && isLnameValid && isEmailValid && isPhoneValid) {
        const userProfile = {
            name: `${inputs.fname.value} ${inputs.lname.value}`,
            email: inputs.email.value,
            phone: inputs.phone.value
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        loadUserProfile();
        showToast('Profile updated successfully!', 'success');
    } else {
        showToast('Please fix errors before saving.', 'error');
    }
});

function loadUserProfile() {
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile) {
        document.getElementById('header-name').textContent = storedProfile.name;
        document.getElementById('settings-display-name').textContent = storedProfile.name;
        if(inputs.fname && inputs.lname) {
            const [first, ...last] = storedProfile.name.split(' ');
            inputs.fname.value = first;
            inputs.lname.value = last.join(' ');
        }
        if(inputs.email) inputs.email.value = storedProfile.email;
        if(inputs.phone) inputs.phone.value = storedProfile.phone;
        
        const initials = storedProfile.name.split(' ').map(n=>n[0]).join('').toUpperCase();
        document.getElementById('header-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(storedProfile.name)}&background=0D8ABC&color=fff`;
        document.getElementById('settings-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(storedProfile.name)}&background=0D8ABC&color=fff&size=128`;
    }
}

function validateEmail(email) {
    return rules.email.test(email);
}

// --- DELETE ACCOUNT LOGIC ---
const deleteBtnNav = document.getElementById('btn-delete-account-nav');
const deleteModal = document.getElementById('modal-delete-account');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

deleteBtnNav?.addEventListener('click', (e) => {
    e.preventDefault();
    deleteModal.classList.add('modal-open');
});

confirmDeleteBtn?.addEventListener('click', () => {
    localStorage.clear(); 
    deleteModal.classList.remove('modal-open');
    showAuth();
    showToast('Account deleted successfully.', 'success');
});

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
let currentPage = 1;
const rowsPerPage = 10;

function saveCustomers() {
    localStorage.setItem('nexusCustomers', JSON.stringify(customers));
    renderCustomers();
    updateDashboardStats();
}

// --- STATE MANAGEMENT: TASKS ---
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

const modalCustomer = document.getElementById('modal-add-customer');
const openModalCustomerBtn = document.getElementById('btn-add-customer');
const addCustomerForm = document.getElementById('add-customer-form');
const modalCustomerTitle = document.getElementById('modal-title');
const modalCustomerSubmitBtn = document.getElementById('modal-submit-btn');

const modalTask = document.getElementById('modal-add-task');
const openModalTaskBtn = document.getElementById('btn-add-task');
const addTaskForm = document.getElementById('add-task-form');

const closeModalElements = document.querySelectorAll('.modal-close, .modal-close-btn');

function updateDashboardStats() {
    const activeUsersEl = document.getElementById('stat-active-users');
    if (activeUsersEl) {
        activeUsersEl.textContent = customers.length.toLocaleString();
    }
}

function renderCustomers(data = customers) {
    if (!customersTableBody) return;
    customersTableBody.innerHTML = '';
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(customer => {
        const initials = (customer.firstName[0] + customer.lastName[0]).toUpperCase();
        const fullName = `${customer.firstName} ${customer.lastName}`;
        const colors = [{ bg: '#E0F2FE', text: '#0284C7' }, { bg: '#F3E8FF', text: '#7E22CE' }, { bg: '#FEE2E2', text: '#DC2626' }, { bg: '#DCFCE7', text: '#166534' }, { bg: '#FEF3C7', text: '#D97706' }];
        const color = colors[fullName.length % colors.length];
        let badgeClass = 'badge--success';
        if (customer.status === 'Pending') badgeClass = 'badge--warning';
        if (customer.status === 'Inactive') badgeClass = 'badge--danger';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><div class="user-info"><div class="user-initials" style="background: ${color.bg}; color: ${color.text}">${initials}</div><div class="user-details-table"><span class="customer-name">${fullName}</span><span class="customer-email-sub">${customer.email}</span></div></div></td>
            <td><span class="badge ${badgeClass}"><span class="dot"></span>${customer.status}</span></td>
            <td>${customer.joined || 'Just now'}</td>
            <td><div class="action-wrapper"><button class="action-btn" onclick="toggleActionMenu(this)"><i class="fa-solid fa-ellipsis"></i></button><div class="action-menu"><a href="#" class="action-item" onclick="openEditModal(${customer.id})"><i class="fa-regular fa-pen-to-square"></i> Edit</a><a href="#" class="action-item text-danger" onclick="deleteCustomer(${customer.id})"><i class="fa-regular fa-trash-can"></i> Delete</a></div></div></td>
        `;
        customersTableBody.appendChild(row);
    });
    
    setupPagination(data, document.querySelector('.pagination-buttons'), rowsPerPage);
    const info = document.getElementById('pagination-info');
    if(info) info.innerHTML = data.length === 0 ? "No customers found" : `Showing <strong>${start + 1}-${Math.min(end, data.length)}</strong> of <strong>${data.length}</strong> customers`;
}

function setupPagination(items, wrapper, rowsPerPage) {
    if(!wrapper) return;
    wrapper.innerHTML = "";
    const pageCount = Math.ceil(items.length / rowsPerPage);
    if (pageCount === 0) return;

    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Previous';
    if (currentPage === 1) prevBtn.disabled = true;
    prevBtn.addEventListener('click', () => { currentPage--; renderCustomers(items); });
    wrapper.appendChild(prevBtn);

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        if (currentPage === i) btn.classList.add('active');
        btn.addEventListener('click', () => { currentPage = i; renderCustomers(items); });
        wrapper.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    if (currentPage === pageCount) nextBtn.disabled = true;
    nextBtn.addEventListener('click', () => { currentPage++; renderCustomers(items); });
    wrapper.appendChild(nextBtn);
}

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
        const dateStr = new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        card.innerHTML = `<button class="task-delete-btn" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-times"></i></button><div class="card-tags"><span class="tag ${tagClass}">${task.tag}</span></div><h4 class="card-title">${task.title}</h4><div class="card-meta"><div class="card-users"><div class="user-initials sm" style="background: #E2E8F0; color: #64748B"><i class="fa-solid fa-user"></i></div></div><div class="card-date"><i class="fa-regular fa-clock"></i> ${dateStr}</div></div>`;
        if (task.status === 'todo') todoContainer.appendChild(card);
        else if (task.status === 'progress') progressContainer.appendChild(card);
        else if (task.status === 'done') doneContainer.appendChild(card);
    });
    document.getElementById('count-todo').textContent = counts.todo;
    document.getElementById('count-progress').textContent = counts.progress;
    document.getElementById('count-done').textContent = counts.done;
}

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

if (openModalTaskBtn) { openModalTaskBtn.addEventListener('click', () => { addTaskForm.reset(); modalTask.classList.add('modal-open'); }); }
if (addTaskForm) { addTaskForm.addEventListener('submit', (e) => { e.preventDefault(); const title = document.getElementById('task-title').value; const tag = document.getElementById('task-tag').value; const date = document.getElementById('task-date').value; const newTask = { id: 'task-' + Date.now(), title, tag, date, status: 'todo' }; tasks.push(newTask); saveTasks(); modalTask.classList.remove('modal-open'); showToast('New task created!', 'success'); addNotification(`New task created: ${title}`); }); }
window.deleteTask = function(id) { if(confirm('Delete this task?')) { tasks = tasks.filter(t => t.id !== id); saveTasks(); showToast('Task deleted', 'error'); } }

if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('customer-id').value;
        const firstName = document.getElementById('customer-name').value;
        const lastName = document.getElementById('customer-surname').value;
        const email = document.getElementById('customer-email').value;
        const role = document.getElementById('customer-role').value;
        const status = document.getElementById('customer-status').value;
        if (id) {
            const index = customers.findIndex(c => c.id == id);
            if (index > -1) { customers[index] = { ...customers[index], firstName, lastName, email, role, status }; showToast('Customer updated!', 'success'); }
        } else {
            customers.unshift({ id: Date.now(), firstName, lastName, email, role, status, joined: new Date().toISOString().split('T')[0] });
            showToast('New customer added!', 'success');
        }
        saveCustomers(); modalCustomer.classList.remove('modal-open');
    });
}
window.deleteCustomer = function(id) { if (confirm('Delete this customer?')) { customers = customers.filter(c => c.id !== id); saveCustomers(); showToast('Customer deleted.', 'error'); } }
window.openEditModal = function(id) { const customer = customers.find(c => c.id === id); if (!customer) return; document.getElementById('customer-id').value = customer.id; document.getElementById('customer-name').value = customer.firstName; document.getElementById('customer-surname').value = customer.lastName; document.getElementById('customer-email').value = customer.email; document.getElementById('customer-role').value = customer.role || 'New User'; document.getElementById('customer-status').value = customer.status; modalCustomerTitle.textContent = 'Edit Customer'; modalCustomerSubmitBtn.textContent = 'Update Changes'; modalCustomer.classList.add('modal-open'); }

if (openModalCustomerBtn) { openModalCustomerBtn.addEventListener('click', () => { addCustomerForm.reset(); document.getElementById('customer-id').value = ''; modalCustomerTitle.textContent = 'Add New Customer'; modalCustomerSubmitBtn.textContent = 'Add Customer'; modalCustomer.classList.add('modal-open'); }); }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('modal-open')); }
closeModalElements.forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(); });

const searchInput = document.getElementById('table-search');
const sortSelect = document.getElementById('sort-select');
if (searchInput) { searchInput.addEventListener('input', (e) => { const term = e.target.value.toLowerCase(); const filtered = customers.filter(c => c.firstName.toLowerCase().includes(term) || c.lastName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)); currentPage = 1; renderCustomers(filtered); }); }
if (sortSelect) { sortSelect.addEventListener('change', (e) => { const type = e.target.value; let sorted = [...customers]; if (type === 'newest') sorted.sort((a, b) => new Date(b.joined) - new Date(a.joined)); if (type === 'oldest') sorted.sort((a, b) => new Date(a.joined) - new Date(b.joined)); if (type === 'az') sorted.sort((a, b) => a.firstName.localeCompare(b.firstName)); if (type === 'za') sorted.sort((a, b) => b.firstName.localeCompare(a.firstName)); currentPage = 1; renderCustomers(sorted); }); }

window.toggleActionMenu = function(btn) { const menu = btn.nextElementSibling; document.querySelectorAll('.action-menu.show').forEach(m => { if (m !== menu) m.classList.remove('show'); }); menu.classList.toggle('show'); }
themeToggleBtn.addEventListener('click', () => { body.classList.toggle('dark-mode'); localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light'); themeToggleBtn.innerHTML = body.classList.contains('dark-mode') ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>'; });

document.querySelectorAll('.sidebar__link[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
        link.classList.add('sidebar__link--active');
        const target = link.getAttribute('data-target');
        document.querySelectorAll('.view').forEach(v => { v.classList.remove('view--active'); if (v.id === target) v.classList.add('view--active'); });
        if (window.innerWidth <= 1024) sidebar.classList.remove('sidebar-open');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-wrapper')) document.querySelectorAll('.action-menu.show').forEach(m => m.classList.remove('show'));
    const profileWrap = document.querySelector('.user-profile-wrapper'); if (profileWrap && !profileWrap.contains(e.target)) document.getElementById('profile-dropdown')?.classList.remove('show');
    const notifWrap = document.querySelector('.notification-wrapper'); if (notifWrap && !notifWrap.contains(e.target)) document.getElementById('notification-dropdown')?.classList.remove('show');
});

const profileBtn = document.getElementById('user-profile-btn'); if (profileBtn) { profileBtn.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('profile-dropdown').classList.toggle('show'); }); }
const notifBtn = document.getElementById('notification-btn'); if (notifBtn) { notifBtn.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('notification-dropdown').classList.toggle('show'); }); }

let notifCount = 0;
function addNotification(message) {
    const list = document.getElementById('notification-list'); const badge = document.getElementById('notification-badge');
    const emptyMsg = list.querySelector('.empty-notif'); if (emptyMsg) emptyMsg.remove();
    const item = document.createElement('div'); item.className = 'notif-item'; item.innerHTML = `<div class="notif-icon"><i class="fa-solid fa-info"></i></div><div class="notif-content"><p>${message}</p><span>Just now</span></div>`;
    list.prepend(item); notifCount++; badge.style.display = 'flex'; badge.textContent = notifCount;
}
document.getElementById('clear-notifications')?.addEventListener('click', (e) => { e.preventDefault(); notifCount = 0; document.getElementById('notification-badge').style.display = 'none'; document.getElementById('notification-list').innerHTML = '<div class="empty-notif">No new notifications</div>'; });

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container'); const toast = document.createElement('div'); toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i><span>${message}</span>`;
    container.appendChild(toast); setTimeout(() => toast.remove(), 3500);
}

if (mobileMenuBtn) { mobileMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.toggle('sidebar-open'); if (sidebarOverlay) sidebarOverlay.classList.toggle('active'); }); }
if (sidebarOverlay) { sidebarOverlay.addEventListener('click', () => { sidebar.classList.remove('sidebar-open'); sidebarOverlay.classList.remove('active'); }); }