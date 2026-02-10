let tableState = {
    query: '',
    limit: 5,
    page: 1,
    selectedIds: []
};

const d = {
    gebi: (id) => document.getElementById(id),
    color: (n) => {
        const palette = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0'];
        return Array.from({length: n}, (_, i) => palette[i % palette.length]);
    },
    templates: {},
    loadTemplates: async function() {
        const res = await fetch('ui.html');
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        doc.querySelectorAll('template').forEach(t => { d.templates[t.id] = t.innerHTML; });
    },
    parse: (tmpl, data) => tmpl.replace(/\${(\w+)}/g, (_, k) => data[k] || ''),
    renderImage: function() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
};

window.navigate = (url) => console.log("Navigasi ke:", url);

const ui = {
    // --- RENDER DASAR ---
    renderHeader: (user) => d.parse(d.templates['tmpl-header'], { ...user, meta: `${user.location} | ${user.email}` }),
    renderStats: (items) => items.map(item => d.parse(d.templates['tmpl-card'], item)).join(''),
    renderProgress: (data, colors) => data.map((p, i) => d.parse(d.templates['tmpl-progress'], { ...p, color: colors[i] })).join(''),

    renderSidebar: function(menuData) {
        return menuData.map(m => {
            const subItems = m.sub ? m.sub.map(s =>
                `<div class="sub-item" onclick="navigate('${s.url}')">${s.label}</div>`
            ).join('') : '';
            return d.parse(d.templates['tmpl-menu'], { label: m.label, subItems });
        }).join('');
    },

    toggleSub: (el) => {
        const submenu = el.nextElementSibling;
        const isActive = submenu.classList.contains('active');
        document.querySelectorAll('.sub-menu').forEach(m => m.classList.remove('active'));
        if (!isActive) submenu.classList.add('active');
    },

    renderTabs: (tabs) => {
        const headers = tabs.map((t, i) => `<div class="tab-link ${i===0?'active':''}" onclick="ui.switchTab(event, 'tab-${i}')">${t.title}</div>`).join('');
        const contents = tabs.map((t, i) => `<div id="tab-${i}" class="tab-pane ${i===0?'active':''}">${t.content}</div>`).join('');
        return d.parse(d.templates['tmpl-tabs'], { headers, contents });
    },

    switchTab: (e, id) => {
        document.querySelectorAll('.tab-link, .tab-pane').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
        d.gebi(id).classList.add('active');
    },

    // --- DATATABLE LOGIC ---
    initTable: function() {
        // Render container statis agar input pencarian tidak hilang fokus
        const container = d.gebi('table-container');
        container.innerHTML = `
            <div id="table-controls-container"></div>
            <div id="table-data-container"></div>
            <div id="table-footer-container"></div>
        `;
        d.gebi('table-controls-container').innerHTML = d.templates['tmpl-table-controls'];
        this.refreshTable();
    },

    refreshTable: function() {
        const data = window.dashboardData.table;

        // 1. Filtering
        let filteredData = data.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(tableState.query.toLowerCase())
            )
        );

        // 2. Pagination Calculation
        const totalRows = filteredData.length;
        const totalPages = Math.ceil(totalRows / tableState.limit) || 1;
        if (tableState.page > totalPages) tableState.page = totalPages;

        const start = (tableState.page - 1) * tableState.limit;
        const pagedData = filteredData.slice(start, start + tableState.limit);

        // 3. Render Data Body
        this.renderTableData(pagedData, start);

        // 4. Render Footer
        this.renderTableFooter(tableState.page, totalPages, totalRows);
    },

    renderTableData: function(pagedData, startOffset) {
        if (pagedData.length === 0) {
            d.gebi('table-data-container').innerHTML = "<p style='padding:20px;'>Data tidak ditemukan.</p>";
            return;
        }

        const keys = Object.keys(window.dashboardData.table[0]);
        let html = `<div style="overflow-x:auto;"><table id="main-table">
                    <thead><tr>
                        <th style="width:40px;"><input type="checkbox" onclick="ui.toggleAllCheck(this)"></th>
                        ${keys.map(k => `<th>${k}</th>`).join('')}
                    </tr></thead><tbody>`;

        pagedData.forEach((row, idx) => {
            html += `<tr>
                        <td><input type="checkbox" class="row-check"></td>
                        ${keys.map(k => `<td onclick="ui.fillForm(${idx + startOffset})">${row[k]}</td>`).join('')}
                    </tr>`;
        });
        html += `</tbody></table></div>`;
        d.gebi('table-data-container').innerHTML = html;
    },

    renderTableFooter: function(page, totalPages, totalRows) {
        d.gebi('table-footer-container').innerHTML = d.templates['tmpl-table-footer'];

        // Info format: "1/2 total data 7"
        const infoLabel = `${page}/${totalPages} total data ${totalRows}`;
        d.gebi('table-info').innerText = infoLabel;

        // Tampilkan/Sembunyikan navigasi
        d.gebi('btn-prev').style.visibility = page > 1 ? 'visible' : 'hidden';
        d.gebi('btn-next').style.visibility = page < totalPages ? 'visible' : 'hidden';
    },

    // --- HANDLERS ---
    handleSearch: function(val) {
        tableState.query = val;
        tableState.page = 1;
        this.refreshTable();
    },

    handleLimit: function(val) {
        tableState.limit = parseInt(val);
        tableState.page = 1;
        this.refreshTable();
    },

    changePage: function(dir) {
        tableState.page += dir;
        this.refreshTable();
    },

    toggleBurger: () => {
        const dd = d.gebi('burger-dropdown');
        if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    },

    toggleAllCheck: (master) => {
        const checks = document.querySelectorAll('.row-check');
        checks.forEach(c => c.checked = master.checked);
    },

    bulkDelete: function() {
        const checked = document.querySelectorAll('.row-check:checked');
        if(checked.length === 0) return alert("Pilih data yang ingin dihapus!");
        if(confirm(`Hapus ${checked.length} baris terpilih?`)) {
            alert("Data berhasil dihapus (Simulasi)");
            this.toggleBurger();
        }
    },

    // --- DRAWER & FORM ---
    fillForm: function(rowIndex) {
        const rowData = window.dashboardData.table[rowIndex];
        const formHtml = Object.keys(rowData).map(key => `
            <div style="margin-bottom:15px;">
                <label style="display:block; font-weight:bold; margin-bottom:5px;">${key}</label>
                <input type="text" value="${rowData[key]}" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
            </div>
        `).join('') + `<button onclick="ui.saveForm()" style="width:100%; padding:12px; background:#2ecc71; color:white; border:none; border-radius:4px; cursor:pointer;">Update</button>`;

        d.gebi('form-container').innerHTML = formHtml;
        this.openDrawer();
    },

    openDrawer: () => {
        d.gebi('drawer-form').classList.add('active');
        d.gebi('overlay').classList.add('active');
    },

    closeDrawer: () => {
        d.gebi('drawer-form').classList.remove('active');
        d.gebi('overlay').classList.remove('active');
    },

    saveForm: () => {
        alert("Data berhasil diperbarui!");
        ui.closeDrawer();
    }
};

// Global click handler untuk menutup burger menu
window.onclick = function(event) {
    if (!event.target.matches('button')) {
        const dd = d.gebi('burger-dropdown');
        if (dd) dd.style.display = 'none';
    }
};
