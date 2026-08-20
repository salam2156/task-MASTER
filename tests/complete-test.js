// TaskMaster - Complete System Test Suite
// PHASE 18: Complete Testing (doc1.md checklist)
// Run: node tests/complete-test.js  (server must be running on :3000)
// Covers: Authentication, Tasks, Dashboard, Notifications, Profile,
//         Categories, Isolation, Pages/Assets.

const http = require('http');
const mysql = require('mysql2/promise');
const base = 'http://localhost:3000';

function req(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const data = body === undefined || body === null ? null : (typeof body === 'string' ? body : JSON.stringify(body));
        const headers = { Connection: 'close' };
        if (data !== null) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(data);
        }
        if (token) headers['Authorization'] = 'Bearer ' + token;
        const r = http.request(base + path, { method, headers }, res => {
            let chunk = '';
            res.on('data', c => chunk += c);
            res.on('end', () => resolve({ status: res.statusCode, body: chunk }));
        });
        r.on('error', reject);
        if (data !== null) r.write(data);
        r.end();
    });
}

const results = [];
let group = '';
function g(name) { group = name; }
function check(name, cond, extra = '') {
    results.push(`${cond ? 'PASS' : 'FAIL'} | [${group}] ${name} ${extra}`);
}

function today(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + (offsetDays || 0));
    return d.toISOString().slice(0, 10);
}

(async () => {
    try {
        const probe = await req('GET', '/');
        if (probe.status !== 200) throw new Error('bad status ' + probe.status);
    } catch (e) {
        console.error('Server not reachable on ' + base + '. Start it first with start-server.bat');
        process.exit(1);
    }
    try {
    const stamp = Date.now();
    const emailA = 'runnera' + stamp + '@test.local';
    const emailB = 'runnerb' + stamp + '@test.local';
    let token = null;
    let tokenB = null;

    // ================= AUTHENTICATION =================
    g('Authentication');
    let r = await req('POST', '/api/auth/register', { name: 'Runner A', email: emailA, password: 'secret123' });
    check('Register', r.status === 201, 'got ' + r.status);
    r = await req('POST', '/api/auth/register', { name: 'Runner B', email: emailB, password: 'secret456' });
    check('Register (2nd user)', r.status === 201);
    r = await req('POST', '/api/auth/register', { name: 'Dup', email: emailA, password: 'secret123' });
    check('Register duplicate email -> 400', r.status === 400);
    r = await req('POST', '/api/auth/register', { name: 'X', email: 'bad', password: 'secret123' });
    check('Register invalid email -> 400', r.status === 400);
    r = await req('POST', '/api/auth/register', { name: 'X', email: 'x@y.com', password: '123' });
    check('Register short password -> 400', r.status === 400);

    r = await req('POST', '/api/auth/login', { email: emailA, password: 'secret123' });
    check('Login correct', r.status === 200);
    token = JSON.parse(r.body).token;
    check('Login returns token', !!token);
    r = await req('POST', '/api/auth/login', { email: emailB, password: 'secret456' });
    tokenB = JSON.parse(r.body).token;
    r = await req('POST', '/api/auth/login', { email: emailA, password: 'wrongpass' });
    check('Invalid credentials -> 401', r.status === 401);
    r = await req('POST', '/api/auth/login', { email: 'nobody@test.local', password: 'x' });
    check('Unknown email -> 401', r.status === 401);
    r = await req('POST', '/api/auth/login', { email: '' });
    check('Login missing password -> 400', r.status === 400);
    r = await req('POST', '/api/auth/logout');
    check('Logout', r.status === 200);

    // ================= TASKS =================
    g('Tasks');
    r = await req('GET', '/api/tasks', null, token);
    check('Read (empty list)', r.status === 200 && JSON.parse(r.body).length === 0);
    r = await req('POST', '/api/tasks', { title: 'Task 1', priority: 'high', due_date: today(1) }, token);
    check('Create', r.status === 201, 'got ' + r.status);
    const t1 = JSON.parse(r.body);
    check('Create defaults status=pending', t1.status === 'pending');
    check('Create returns category_name', 'category_name' in t1);
    r = await req('POST', '/api/tasks', { title: 'Task 2', description: 'desc', status: 'in_progress', priority: 'urgent', due_date: today(-1) }, token);
    const t2 = JSON.parse(r.body);
    check('Create w/ full fields', r.status === 201 && t2.status === 'in_progress' && t2.priority === 'urgent');
    r = await req('POST', '/api/tasks', { title: '' }, token);
    check('Create empty title -> 400', r.status === 400);
    r = await req('POST', '/api/tasks', { title: 'Bad status', status: 'weird' }, token);
    check('Create invalid status -> 400', r.status === 400);
    r = await req('POST', '/api/tasks', { title: 'Bad date', due_date: '2026-13-45' }, token);
    check('Create invalid due date -> 400', r.status === 400);

    r = await req('PUT', '/api/tasks/' + t1.id, { status: 'completed', priority: 'low', title: 'Task 1 renamed' }, token);
    const u1 = JSON.parse(r.body);
    check('Update status', r.status === 200 && u1.status === 'completed');
    check('Update priority', u1.priority === 'low');
    check('Update title', u1.title === 'Task 1 renamed');
    r = await req('PUT', '/api/tasks/' + t1.id, { status: 'nope' }, token);
    check('Update invalid status -> 400', r.status === 400);
    r = await req('PUT', '/api/tasks/999999', { status: 'pending' }, token);
    check('Update missing task -> 404', r.status === 404);
    r = await req('GET', '/api/tasks', null, token);
    const list = JSON.parse(r.body);
    check('Read (2 tasks)', list.length === 2);
    const overdue = list.filter(t => t.due_date && t.due_date < today(0) && t.status !== 'completed');
    check('Overdue identified in list', overdue.some(t => t.id === t2.id));

    // ================= CATEGORIES =================
    g('Categories');
    r = await req('POST', '/api/categories', { name: 'Work' }, token);
    check('Create category', r.status === 201);
    const catId = JSON.parse(r.body).category.id;
    r = await req('POST', '/api/categories', { name: 'Work' }, token);
    check('Duplicate category -> 400', r.status === 400);
    r = await req('POST', '/api/categories', { name: 'Study' }, token);
    const catId2 = JSON.parse(r.body).category.id;
    r = await req('GET', '/api/categories', null, token);
    check('Read categories', r.status === 200 && JSON.parse(r.body).length === 2);
    r = await req('POST', '/api/tasks', { title: 'Categorized', category_id: catId }, token);
    const cTask = JSON.parse(r.body);
    check('Task with category', r.status === 201 && cTask.category_name === 'Work');
    r = await req('PUT', '/api/tasks/' + cTask.id, { category_id: catId2 }, token);
    check('Change task category', JSON.parse(r.body).category_name === 'Study');
    r = await req('PUT', '/api/tasks/' + cTask.id, { category_id: '' }, token);
    check('Unassign category', JSON.parse(r.body).category_name === null);
    r = await req('POST', '/api/tasks', { title: 'Bad cat', category_id: 999999 }, token);
    check('Task with others category -> 400', r.status === 400);
    r = await req('DELETE', '/api/categories/' + catId, null, token);
    check('Delete category', r.status === 200);
    r = await req('DELETE', '/api/categories/' + catId, null, token);
    check('Delete category again -> 404', r.status === 404);

    // ================= DASHBOARD =================
    g('Dashboard');
    r = await req('GET', '/api/dashboard/stats', null, token);
    const stats = JSON.parse(r.body);
    check('Statistics endpoint', r.status === 200);
    check('Stats total = 3', stats.total === 3);
    check('Stats pending = 1', stats.pending === 1);
    check('Stats inProgress = 1', stats.inProgress === 1);
    check('Stats completed = 1', stats.completed === 1);
    check('Stats overdue = 1', stats.overdue === 1);
    check('Stats progress %', stats.completionPercentage === 33);
    check('Charts status arrays', Array.isArray(stats.charts.status.labels) && stats.charts.status.data.length === 3);
    check('Charts priority arrays', stats.charts.priority.data.length === 4);
    check('Charts completion', stats.charts.completion.completed === 1 && stats.charts.completion.remaining === 2);

    // ================= NOTIFICATIONS =================
    g('Notifications');
    r = await req('GET', '/api/notifications', null, token);
    const n1 = JSON.parse(r.body);
    check('Display (generated)', n1.length >= 2);
    r = await req('GET', '/api/notifications', null, token);
    const n2 = JSON.parse(r.body);
    check('No duplicates on refresh', n1.length === n2.length);
    const unread = n2.find(n => !n.is_read);
    if (unread) {
        r = await req('PUT', '/api/notifications/' + unread.id, null, token);
        check('Mark as read', r.status === 200);
    } else {
        check('Unread notification found (mark-as-read source)', false, 'n2=' + JSON.stringify(n2.map(x => x.title)));
    }
    r = await req('PUT', '/api/notifications/999999', null, token);
    check('Mark others notification -> 404', r.status === 404);
    r = await req('GET', '/api/notifications', null, token);
    const n3 = JSON.parse(r.body);
    check('Read stays read after refresh', unread ? n3.find(n => n.id === unread.id).is_read === 1 : false);
    check('No resurrection duplicates', n3.length === n1.length);

    // ================= PROFILE =================
    g('Profile');
    r = await req('GET', '/api/profile', null, token);
    const prof = JSON.parse(r.body);
    check('View profile', r.status === 200 && prof.name === 'Runner A');
    check('No password leaked', !prof.password);
    r = await req('PUT', '/api/profile', { name: 'Runner A2', email: emailA, avatar: 'https://example.com/a.png' }, token);
    check('Update name/email/avatar', r.status === 200 && JSON.parse(r.body).user.name === 'Runner A2');
    r = await req('PUT', '/api/profile', { name: '' }, token);
    check('Update empty name -> 400', r.status === 400);
    r = await req('PUT', '/api/profile', { email: emailB }, token);
    check('Email already in use -> 400', r.status === 400);
    r = await req('PUT', '/api/profile', { newPassword: 'newpass123', currentPassword: 'wrong' }, token);
    check('Wrong current password -> 400', r.status === 400);
    r = await req('PUT', '/api/profile', { newPassword: 'newpass123', currentPassword: 'secret123' }, token);
    check('Change password', r.status === 200);
    r = await req('POST', '/api/auth/login', { email: emailA, password: 'newpass123' });
    check('Login with new password', r.status === 200);
    r = await req('POST', '/api/auth/login', { email: emailA, password: 'secret123' });
    check('Old password rejected', r.status === 401);
    r = await req('PUT', '/api/profile', { newPassword: 'secret123', currentPassword: 'newpass123' }, token);
    check('Revert password', r.status === 200);

    // ================= ISOLATION (User A vs User B) =================
    g('Isolation');
    r = await req('GET', '/api/tasks', null, tokenB);
    const listB = JSON.parse(r.body);
    check('B sees own tasks only', listB.length === 0);
    check('B cannot see A tasks', !JSON.parse((await req('GET', '/api/tasks', null, tokenB)).body).some(t => t.id === t1.id));
    r = await req('PUT', '/api/tasks/' + t1.id, { status: 'pending' }, tokenB);
    check('B cannot update A task -> 404', r.status === 404);
    r = await req('DELETE', '/api/tasks/' + t1.id, null, tokenB);
    check('B cannot delete A task -> 404', r.status === 404);
    r = await req('DELETE', '/api/categories/' + catId2, null, tokenB);
    check('B cannot delete A category -> 404', r.status === 404);
    r = await req('PUT', '/api/notifications/' + (unread ? unread.id : 999999), null, tokenB);
    check('B cannot read A notification -> 404', r.status === 404);
    r = await req('GET', '/api/notifications', null, tokenB);
    check('B notifications empty', JSON.parse(r.body).length === 0);

    // ================= PAGES & ASSETS =================
    g('Pages');
    r = await req('GET', '/');
    check('Home page 200', r.status === 200);
    check('Home page branding + CTAs', r.body.includes('TaskMaster') && r.body.includes('/login') && r.body.includes('/register'));
    for (const [name, path, auth] of [['login', '/login', false], ['register', '/register', false], ['dashboard', '/dashboard', true], ['profile', '/profile', true]]) {
        r = await req('GET', path, null, auth ? token : null);
        check(name + ' page 200', r.status === 200);
    }
    for (const asset of ['/css/style.css', '/js/main.js', '/js/api.js', '/js/auth.js', '/js/dashboard.js', '/images/avatar.png']) {
        r = await req('GET', asset);
        check(asset + ' served', r.status === 200);
    }
    r = await req('GET', '/login');
    check('Login has navbar + footer', r.body.includes('Sign Up Free') && r.body.includes('All rights reserved'));
    check('Login has real-time validation hints', r.body.includes('emailHint') && r.body.includes('passwordHint'));
    r = await req('GET', '/register');
    check('Register has navbar + footer', r.body.includes('Sign Up Free') && r.body.includes('All rights reserved'));
    check('Register has real-time validation hints', r.body.includes('nameHint') && r.body.includes('emailHint') && r.body.includes('passwordHint'));
    r = await req('GET', '/missing');
    check('Unknown page 404', r.status === 404);
    check('Custom 404 page rendered', r.body.includes('Back to Home') && r.body.includes('404'));
    r = await req('GET', '/js/main.js');
    check('Toast system present', r.body.includes('function showToast'));

    // ================= UI STATIC CHECKS =================
    g('UI (static)');
    r = await req('GET', '/dashboard', null, token);
    const dashHtml = r.body;
    check('Viewport meta (mobile)', dashHtml.includes('width=device-width'));
    check('Dark mode config', dashHtml.includes("darkMode: 'class'"));
    check('Dark classes present', dashHtml.includes('dark:bg-slate-900'));
    check('Responsive breakpoints (sidebar)', dashHtml.includes('lg:w-64'));
    check('Responsive grid (stats)', dashHtml.includes('xl:grid-cols-6'));
    r = await req('GET', '/css/style.css');
    check('overflow-x guard', r.body.includes('overflow-x: hidden'));
    check('focus-visible ring', r.body.includes('focus-visible'));
    check('Toast styles present', r.body.includes('#toastContainer') && r.body.includes('.toast-error'));
    check('Smooth dark-mode transition', r.body.includes('transition: background-color 0.3s'));
    r = await req('GET', '/');
    check('Home footer (quick links + social + copyright)', r.body.includes('Quick Links') && r.body.includes('fa-github') && r.body.includes('All rights reserved'));

    // ================= DELETE =================
    g('Delete');
    r = await req('DELETE', '/api/tasks/' + t1.id, null, token);
    check('Delete task', r.status === 200);
    r = await req('DELETE', '/api/tasks/' + t2.id, null, token);
    check('Delete task 2', r.status === 200);
    r = await req('DELETE', '/api/tasks/' + cTask.id, null, token);
    check('Delete task 3', r.status === 200);
    r = await req('DELETE', '/api/tasks/' + t1.id, null, token);
    check('Delete again -> 404', r.status === 404);
    r = await req('DELETE', '/api/categories/' + catId2, null, token);
    check('Delete category 2', r.status === 200);
    r = await req('GET', '/api/tasks', null, token);
    check('Final list empty', JSON.parse(r.body).length === 0);
    } catch (err) {
        results.push('FAIL | [SCRIPT] crashed: ' + err.message);
    }

    console.log(results.join('\n'));
    const fails = results.filter(x => x.startsWith('FAIL')).length;
    console.log('\n' + (results.length - fails) + '/' + results.length + ' passed');

    // Self-cleanup: remove the runner users created by this suite
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'task_manager'
        });
        await conn.query('DELETE FROM users WHERE email LIKE ?', ['runner%@test.local']);
        await conn.end();
        console.log('Test users cleaned up.');
    } catch (err) {
        console.log('Cleanup skipped:', err.message);
    }

    process.exit(fails ? 1 : 0);
})();
