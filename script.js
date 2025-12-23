// --- STATE MANAGEMENT (DATA) ---
const defaultCustomers = [
    { id: 1, firstName: 'Ayşe', lastName: 'Soylu', email: 'ayse@example.com', role: 'Project Manager', status: 'Active', joined: '2023-12-01' },
    { id: 2, firstName: 'Mustafa', lastName: 'Kaya', email: 'mustafa@example.com', role: 'Developer', status: 'Pending', joined: '2023-11-15' },
    { id: 3, firstName: 'Burak', lastName: 'Er', email: 'burak@example.com', role: 'Designer', status: 'Inactive', joined: '2023-10-20' }
];

let customers = JSON.parse(localStorage.getItem('nexusCustomers')) || defaultCustomers;

function saveCustomers() {
    localStorage.setItem('nexusCustomers', JSON.stringify(customers));
    renderCustomers();
}

// --- DOM ELEMENTS ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const customersTableBody = document.querySelector('#customers-table tbody');
const modal = document.getElementById('modal-add-customer');
const openModalBtn = document.getElementById('btn-add-customer');
const closeModalElements = document.querySelectorAll('.modal-close, .modal-close-btn');
const addCustomerForm = document.getElementById('add-customer-form');
const modalTitle = document.getElementById('modal-title');
const modalSubmitBtn = document.getElementById('modal-submit-btn');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
    renderCustomers();
});

// --- RENDER CUSTOMERS (GÜNCELLENDİ: SADELEŞTİRİLMİŞ TABLO) ---
function renderCustomers(data = customers) {
    if (!customersTableBody) return;
    customersTableBody.innerHTML = '';
    
    data.forEach(customer => {
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
        // Sütunlar azaltıldı, email ismin altına alındı
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
    
    const info = document.getElementById('pagination-info');
    if(info) info.innerHTML = `Showing <strong>${data.length}</strong> customers`;
}

// --- CRUD OPERATIONS ---
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
                addNotification(`Updated customer details: ${fullName}`);
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
        closeModal();
    });
}

window.deleteCustomer = function(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
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
    modalTitle.textContent = 'Edit Customer';
    modalSubmitBtn.textContent = 'Update Changes';
    modal.classList.add('modal-open');
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

// --- KANBAN DRAG & DROP LOGIC ---
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    draggedElement.classList.remove('dragging');
    
    var targetColumn = ev.target.closest('.kanban-items');
    if (targetColumn) {
        targetColumn.appendChild(draggedElement);
    }
}


// --- MODAL UTILS ---
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        addCustomerForm.reset();
        document.getElementById('customer-id').value = '';
        modalTitle.textContent = 'Add New Customer';
        modalSubmitBtn.textContent = 'Add Customer';
        modal.classList.add('modal-open');
    });
}

function closeModal() { modal.classList.remove('modal-open'); }
closeModalElements.forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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
    if (body.classList.contains('dark-mode')) {
        themeToggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
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

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}