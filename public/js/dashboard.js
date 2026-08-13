// TaskMaster - Dashboard Logic
// PHASE 7: Task Management Frontend
// Tasks come from the real API (MySQL -> Express -> Fetch -> UI)

let allTasks = [];
let allCategories = [];

// Current search / filter / sort state
let filters = {
    search: '',
    status: '',
    priority: '',
    category: '',
    sort: 'created_desc'
};

// Check if a task is overdue (due date passed and not completed)
// Parse the date parts as LOCAL midnight so "due today" is never overdue
function isOverdue(task) {
    if (!task.due_date || task.status === 'completed') return false;
    const [year, month, day] = task.due_date.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
}

// Guard: not logged in -> login page
function requireAuth() {
    const user = getCurrentUser();
    if (!localStorage.getItem('token') || !user) {
        window.location.href = '/login';
        return null;
    }
    return user;
}

// Escape user text so it renders safely in HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

// Format a MySQL/ISO date as DD MMM YYYY (local date parts, no timezone shift)
function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return 'No due date';
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return 'No due date';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Badge styles for status and priority
function statusBadge(status) {
    const styles = {
        pending: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200',
        in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    };
    const labels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
    return `<span class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${styles[status] || styles.pending}">
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>${labels[status] || status}</span>`;
}

function priorityBadge(priority) {
    const styles = {
        low: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    };
    const labels = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };
    return `<span class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${styles[priority] || styles.medium}">
        <i class="fas fa-flag"></i>${labels[priority] || priority}</span>`;
}

// Chart instances (created once, updated with new data)
let statusChart = null;
let priorityChart = null;
let completionChart = null;

// Chart colors from the approved palette (doc.md section 5)
const CHART_COLORS = {
    status: ['#94a3b8', '#F59E0B', '#10B981'],
    priority: ['#38bdf8', '#2563EB', '#fb923c', '#EF4444'],
    completion: ['#10B981', '#cbd5e1']
};

let lastStats = null;

// ---------- STATISTICS ----------
// Load real statistics from the database (no hardcoded values)
async function loadStats() {
    try {
        const stats = await apiRequest('/dashboard/stats', 'GET');
        lastStats = stats;
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statCompleted').textContent = stats.completed;
        document.getElementById('statPending').textContent = stats.pending;
        document.getElementById('statInProgress').textContent = stats.inProgress;
        document.getElementById('statOverdue').textContent = stats.overdue;
        document.getElementById('statProgress').textContent = stats.completionPercentage;
        document.getElementById('progressBar').style.width = stats.completionPercentage + '%';

        // Update the three charts with real API data
        applyCharts(stats);
    } catch (error) {
        console.error('Failed to load statistics:', error.message);
    }
}

function applyCharts(stats) {
    updateChart('statusChart', statusChart, chart => statusChart = chart,
        stats.charts.status, CHART_COLORS.status, 'doughnut');
    updateChart('priorityChart', priorityChart, chart => priorityChart = chart,
        stats.charts.priority, CHART_COLORS.priority, 'doughnut');
    updateChart('completionChart', completionChart, chart => completionChart = chart,
        { labels: ['Completed', 'Incomplete'], data: [stats.charts.completion.completed, stats.charts.completion.remaining] },
        CHART_COLORS.completion, 'doughnut');
}

// Refresh chart legend colors after a theme toggle (re-applies last loaded stats)
function refreshChartColors() {
    if (lastStats) applyCharts(lastStats);
}

function chartTextColor() {
    return document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b';
}

// Create a chart once, then just update its data (all values come from the API)
function updateChart(canvasId, chartInstance, saveChart, chartData, colors, type) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (!chartInstance) {
        saveChart(new Chart(canvas, {
            type,
            data: { labels: chartData.labels, datasets: [{ data: chartData.data, backgroundColor: colors, borderWidth: 0 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 }, color: chartTextColor() } } }
            }
        }));
    } else {
        chartInstance.data.labels = chartData.labels;
        chartInstance.data.datasets[0].data = chartData.data;
        chartInstance.options.plugins.legend.labels.color = chartTextColor();
        chartInstance.update();
    }
}

// ---------- PROFILE (header welcome + avatar, live from API) ----------
async function loadProfileHeader() {
    try {
        const profile = await apiRequest('/profile', 'GET');
        document.getElementById('userName').textContent = profile.name.split(' ')[0];
        document.getElementById('userAvatar').src = profile.avatar || '/images/avatar.png';
        const user = getCurrentUser();
        if (user) setSession(localStorage.getItem('token'), { ...user, name: profile.name, avatar: profile.avatar });
    } catch (error) {
        console.error('Failed to load profile:', error.message);
    }
}

// ---------- NOTIFICATIONS ----------
// Load notifications (generated server-side from the user's tasks)
async function loadNotifications() {
    try {
        const notifications = await apiRequest('/notifications', 'GET');
        renderNotifications(notifications);
    } catch (error) {
        console.error('Failed to load notifications:', error.message);
    }
}

// Show the notification list + unread badge
function renderNotifications(notifications) {
    const listEl = document.getElementById('notifList');
    const badgeEl = document.getElementById('notifBadge');
    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (unreadCount === 0) {
        badgeEl.classList.add('hidden');
    } else {
        badgeEl.classList.remove('hidden');
        badgeEl.classList.add('flex');
        badgeEl.textContent = unreadCount;
    }

    if (notifications.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-10 text-slate-400">
                <i class="fas fa-bell-slash text-2xl mb-2"></i>
                <p class="text-sm">No notifications</p>
            </div>`;
        return;
    }

    listEl.innerHTML = notifications.map(n => `
        <button onclick="markNotificationRead(${n.id})"
                class="w-full text-left px-4 py-3 flex gap-3 transition ${n.is_read ? 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800' : 'bg-blue-50/60 hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'}">
            <span class="mt-1 shrink-0 w-2 h-2 rounded-full ${n.is_read ? 'bg-slate-300 dark:bg-slate-600' : 'bg-blue-600'}"></span>
            <span class="min-w-0">
                <span class="block text-sm font-semibold ${n.is_read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'} truncate">${escapeHtml(n.title)}</span>
                <span class="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">${escapeHtml(n.message)}</span>
                <span class="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">${timeAgo(n.created_at)}${n.is_read ? '' : ' - unread'}</span>
            </span>
        </button>
    `).join('');
}

// Toggle the notifications dropdown
function toggleNotifications() {
    document.getElementById('notifPanel').classList.toggle('hidden');
}

// Mark a notification as read
async function markNotificationRead(id) {
    try {
        await apiRequest(`/notifications/${id}`, 'PUT');
        await loadNotifications();
    } catch (error) {
        console.error('Failed to mark notification:', error.message);
    }
}

// Human-friendly time ("5m ago", "2h ago", "3d ago")
function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// ---------- LOAD TASKS ----------
async function loadTasks() {
    const listEl = document.getElementById('taskList');
    listEl.innerHTML = `
        <div class="text-center py-16 text-slate-400">
            <i class="fas fa-spinner fa-spin text-2xl mb-3"></i>
            <p>Loading your tasks...</p>
        </div>`;

    try {
        const [tasks, categories] = await Promise.all([
            apiRequest('/tasks', 'GET'),
            apiRequest('/categories', 'GET')
        ]);
        allTasks = tasks;
        allCategories = categories;
        renderCategories();
        updateCategoryFilterOptions();
        applyFilters();
        loadStats();
    } catch (error) {
        listEl.innerHTML = `
            <div class="text-center py-16 text-red-500">
                <i class="fas fa-circle-exclamation text-2xl mb-3"></i>
                <p>${escapeHtml(error.message)}</p>
            </div>`;
    }
}

// Build the category filter options from the user's real categories
function updateCategoryFilterOptions() {
    const select = document.getElementById('categoryFilter');
    const current = filters.category;
    select.innerHTML = '<option value="">All Categories</option>' +
        allCategories.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
    filters.category = allCategories.some(c => c.name === current) ? current : '';
    select.value = filters.category;
}

// ---------- CATEGORIES ----------
// Render the categories panel (name + real task count)
function renderCategories() {
    const listEl = document.getElementById('categoryList');
    const formSelect = document.getElementById('categorySelect');

    // Fill the task form dropdown
    formSelect.innerHTML = '<option value="">No category</option>' +
        allCategories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');

    if (allCategories.length === 0) {
        listEl.innerHTML = '<li class="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No categories yet.<br>Create one above.</li>';
        return;
    }

    listEl.innerHTML = allCategories.map(cat => {
        const count = allTasks.filter(t => t.category_id === cat.id).length;
        const active = filters.category === cat.name;
        return `
            <li class="flex items-center gap-1.5">
                <button onclick="filterByCategory('${escapeHtml(cat.name)}')"
                        class="flex-1 min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition ${active ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}">
                    <span class="flex items-center gap-2 min-w-0">
                        <i class="fas fa-tag text-slate-400 dark:text-slate-500 shrink-0"></i>
                        <span class="truncate">${escapeHtml(cat.name)}</span>
                    </span>
                    <span class="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300 shrink-0">${count}</span>
                </button>
                <button onclick="deleteCategory(${cat.id}, '${escapeHtml(cat.name)}')" title="Delete category"
                        class="w-8 h-8 shrink-0 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </li>`;
    }).join('');
}

// Delete a category (owner only). Tasks keep working - their category becomes "none"
async function deleteCategory(id, name) {
    if (!confirm(`Delete category "${name}"?\nTasks in this category will keep their data but have no category.`)) return;

    const errorEl = document.getElementById('categoryError');
    errorEl.classList.remove('hidden');
    errorEl.textContent = 'Deleting...';
    errorEl.classList.remove('text-red-600', 'dark:text-red-400', 'text-emerald-600', 'dark:text-emerald-400');
    errorEl.classList.add('text-emerald-600', 'dark:text-emerald-400');

    try {
        await apiRequest(`/categories/${id}`, 'DELETE');
        if (filters.category === name) {
            filters.category = '';
            document.getElementById('categoryFilter').value = '';
        }
        allCategories = allCategories.filter(c => c.id !== id);
        renderCategories();
        updateCategoryFilterOptions();
        applyFilters();
        errorEl.textContent = `Category "${name}" deleted`;
        setTimeout(() => errorEl.classList.add('hidden'), 3000);
    } catch (error) {
        errorEl.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        errorEl.classList.add('text-red-600', 'dark:text-red-400');
        errorEl.textContent = error.message;
        setTimeout(() => errorEl.classList.add('hidden'), 5000);
    }
}

// Filter tasks by clicking a category in the panel
function filterByCategory(name) {
    filters.category = filters.category === name ? '' : name;
    document.getElementById('categoryFilter').value = filters.category;
    renderCategories();
    applyFilters();
}

// Create a new category from the panel input
async function createCategory() {
    const input = document.getElementById('categoryName');
    const errorEl = document.getElementById('categoryError');
    const name = input.value.trim();

    if (!name) {
        errorEl.textContent = 'Please enter a category name';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');

    try {
        await apiRequest('/categories', 'POST', { name });
        input.value = '';
        await loadTasks();
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
}

// Filter, sort and render the tasks
function applyFilters() {
    let tasks = allTasks.filter(task => {
        // Search by title
        if (filters.search && !task.title.toLowerCase().includes(filters.search)) return false;
        // Filter by status
        if (filters.status && task.status !== filters.status) return false;
        // Filter by priority
        if (filters.priority && task.priority !== filters.priority) return false;
        // Filter by category
        if (filters.category && task.category_name !== filters.category) return false;
        return true;
    });

    // Sort by due date (tasks without a due date go last) or keep newest first
    if (filters.sort === 'due_asc' || filters.sort === 'due_desc') {
        const dir = filters.sort === 'due_asc' ? 1 : -1;
        tasks.sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return (a.due_date < b.due_date ? -1 : 1) * dir;
        });
    }

    renderTasks(tasks);
}

// ---------- RENDER TASKS ----------
function renderTasks(tasks) {
    const listEl = document.getElementById('taskList');
    const countEl = document.getElementById('taskCount');

    if (filters.search || filters.status || filters.priority || filters.category) {
        countEl.textContent = `${tasks.length} of ${allTasks.length} tasks`;
    } else {
        countEl.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
    }

    if (allTasks.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <i class="fas fa-clipboard-list text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
                <p class="text-slate-500 dark:text-slate-400 font-medium">No tasks yet</p>
                <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Click "Add Task" to create your first task</p>
            </div>`;
        return;
    }

    if (tasks.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <i class="fas fa-filter text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
                <p class="text-slate-500 dark:text-slate-400 font-medium">No tasks match your filters</p>
                <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Try changing the search or filters</p>
            </div>`;
        return;
    }

    listEl.innerHTML = tasks.map(task => {
        const overdue = isOverdue(task);
        return `
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition ${overdue ? 'border-red-200 dark:border-red-900' : ''}">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 truncate">${escapeHtml(task.title)}</h3>
                        ${statusBadge(task.status)}
                        ${priorityBadge(task.priority)}
                        ${task.category_name ? `<span class="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><i class="fas fa-tag"></i> ${escapeHtml(task.category_name)}</span>` : ''}
                        ${overdue ? '<span class="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"><i class="fas fa-exclamation-triangle"></i> Overdue</span>' : ''}
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">${escapeHtml(task.description) || 'No description'}</p>
                    <p class="text-xs ${overdue ? 'text-red-600 font-semibold dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}">
                        <i class="fas fa-calendar-day"></i> Due: ${formatDate(task.due_date)}
                    </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <select onchange="changeStatus(${task.id}, this.value)"
                            class="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 outline-none focus:border-blue-600 transition">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <select onchange="changePriority(${task.id}, this.value)"
                            class="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 outline-none focus:border-blue-600 transition">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                    </select>
                    <button onclick="openEditModal(${task.id})" title="Edit"
                            class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button onclick="deleteTask(${task.id})" title="Delete"
                            class="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ---------- CREATE / UPDATE STATUS & PRIORITY ----------
async function changeStatus(id, newStatus) {
    try {
        await apiRequest(`/tasks/${id}`, 'PUT', { status: newStatus });
        await loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

async function changePriority(id, newPriority) {
    try {
        await apiRequest(`/tasks/${id}`, 'PUT', { priority: newPriority });
        await loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

// ---------- ADD / EDIT TASK ----------
function openAddModal() {
    document.getElementById('taskId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('status').value = 'pending';
    document.getElementById('priority').value = 'medium';
    document.getElementById('dueDate').value = '';
    document.getElementById('categorySelect').value = '';
    document.getElementById('formError').classList.add('hidden');
    document.getElementById('taskModal').classList.add('open');
    document.getElementById('title').focus();
}

function openEditModal(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('taskId').value = task.id;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description || '';
    document.getElementById('status').value = task.status;
    document.getElementById('priority').value = task.priority;
    document.getElementById('dueDate').value = task.due_date ? task.due_date.slice(0, 10) : '';
    document.getElementById('categorySelect').value = task.category_id || '';
    document.getElementById('formError').classList.add('hidden');
    document.getElementById('taskModal').classList.add('open');
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('open');
}

async function saveTask(event) {
    event.preventDefault();

    const id = document.getElementById('taskId').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const status = document.getElementById('status').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('dueDate').value;
    const categoryId = document.getElementById('categorySelect').value;
    const errorBox = document.getElementById('formError');
    const saveBtn = document.getElementById('saveBtn');

    if (!title) {
        errorBox.textContent = 'Title is required';
        errorBox.classList.remove('hidden');
        return;
    }

    errorBox.classList.add('hidden');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        if (id) {
            await apiRequest(`/tasks/${id}`, 'PUT', { title, description, status, priority, due_date: dueDate || null, category_id: categoryId || null });
        } else {
            await apiRequest('/tasks', 'POST', { title, description, status, priority, due_date: dueDate || null, category_id: categoryId || null });
        }

        // Success flash (green check) before closing
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.classList.add('bg-emerald-600');
        setTimeout(() => {
            saveBtn.classList.remove('bg-emerald-600');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Task';
            closeModal();
            loadTasks();
        }, 450);
    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove('hidden');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Task';
    }
}

// ---------- DELETE TASK ----------
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        await apiRequest(`/tasks/${id}`, 'DELETE');
        await loadTasks();
    } catch (error) {
        alert(error.message);
    }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    if (!user) return;

    document.getElementById('taskForm').addEventListener('submit', saveTask);
    document.getElementById('taskModal').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) closeModal();
    });

    // Search & filter listeners (real data, client-side)
    document.getElementById('searchInput').addEventListener('input', (event) => {
        filters.search = event.target.value.trim().toLowerCase();
        applyFilters();
    });
    document.getElementById('statusFilter').addEventListener('change', (event) => {
        filters.status = event.target.value;
        applyFilters();
    });
    document.getElementById('priorityFilter').addEventListener('change', (event) => {
        filters.priority = event.target.value;
        applyFilters();
    });
    document.getElementById('categoryFilter').addEventListener('change', (event) => {
        filters.category = event.target.value;
        applyFilters();
    });
    document.getElementById('sortFilter').addEventListener('change', (event) => {
        filters.sort = event.target.value;
        applyFilters();
    });

    // Notifications: toggle on bell click, close when clicking outside
    document.getElementById('notifBtn').addEventListener('click', (event) => {
        event.stopPropagation();
        toggleNotifications();
    });
    document.addEventListener('click', () => {
        document.getElementById('notifPanel').classList.add('hidden');
    });

    loadTasks();
    loadNotifications();
    loadProfileHeader();
});