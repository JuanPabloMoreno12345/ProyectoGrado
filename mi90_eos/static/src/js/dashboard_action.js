/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, onMounted, useRef } from "@odoo/owl";

class Mi90DashboardAction extends Component {
  static template = "mi90_eos.Dashboard";

  setup() {
    this.rootRef = useRef("root");
    
    onMounted(() => {
      setTimeout(() => {
        this.setupNavigation();
        // Fetch live data and render
        this.fetchAll();
      }, 100);
    });
  }

  async fetchAll() {
    try {
      await Promise.all([
        this.fetchAndRenderScorecard(),
        this.fetchAndRenderRocks(),
        this.fetchAndRenderTodos(),
        this.fetchAndRenderIssues(),
        this.fetchAndRenderMeetings(),
      ]);
    } catch (e) {
      // Keep silent; logs can be inspected in browser console
      console.error('mi90_eos: fetchAll error', e);
    }
  }

  async fetchJson(url, options) {
    const res = await fetch(url, Object.assign({credentials: 'same-origin'}, options || {}));
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.json();
  }

  async fetchAndRenderRocks() {
    const rootEl = this.rootRef.el || this.el;
    try {
      const data = await this.fetchJson('/mi90_eos/data/rocks');
      const rocks = data.rocks || [];
      this.renderRocks(rootEl, rocks);
    } catch (e) {
      console.warn('Unable to load rocks', e);
    }
  }

  renderRocks(rootEl, rocks) {
    const list = rootEl.querySelector('.rocks--list');
    const progLabel = rootEl.querySelector('.rocks--wrap div[style*="Progreso general"]');
    if (progLabel && rocks.length) {
      try {
        const avg = Math.round((rocks.reduce((s,r) => s + (r.progress || 0), 0) / rocks.length) || 0);
        progLabel.textContent = `Progreso general: ${avg}%`;
      } catch(e){/* ignore */}
    }
    if (!list) return;
    list.innerHTML = rocks.map(r => {
      const owner = (r.owner_id && r.owner_id[1]) ? r.owner_id[1] : (r.owner_id || '—');
      const due = r.due_date || '—';
      const progress = r.progress || 0;
      const status = r.status || 'En progreso';
      const krsHtml = (r.key_result_ids && r.key_result_ids.length) ? `<ul style="margin:6px 0 0 18px;color:var(--muted);font-size:13px">${r.key_result_ids.map(kr => `<li>${kr}</li>`).join('')}</ul>` : '';
      const notes = r.description ? (r.description.substring(0,120)) : '';
      return `
        <li class="rock">
          <div class="rock--header" style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="rock--title">${r.name || ''}</div>
              <div style="font-size:12px;color:var(--muted);padding:2px 8px;border-radius:12px;background:#f1f5f9">${owner}</div>
            </div>
            <div style="font-size:12px;color:var(--muted)">Due: ${due}</div>
          </div>
          <div class="rock--progress" style="margin-top:8px;background:#f3e8ff;border-radius:999px;height:10px;overflow:hidden">
            <div class="rock--progress-bar" style="width:${progress}%;background:linear-gradient(90deg,var(--lav),#d8b4fe);height:100%"></div>
          </div>
          <div class="rock--meta" style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:6px">
            <span>${status}</span>
            <span>Progreso: ${progress}%</span>
          </div>
          ${krsHtml}
          <div class="rock--notes" style="margin-top:8px;font-size:12px;color:var(--muted)">${notes}</div>
        </li>`;
    }).join('\n');
  }

  async fetchAndRenderTodos() {
    const rootEl = this.rootRef.el || this.el;
    try {
      const data = await this.fetchJson('/mi90_eos/data/todos');
      const todos = data.todos || [];
      this.renderTodos(rootEl, todos);
    } catch (e) {
      console.warn('Unable to load todos', e);
    }
  }

  renderTodos(rootEl, todos) {
    // Render a 4-column board using todo.status
    const board = rootEl.querySelector('.todos-board');
    if (!board) return;

    const columns = {
      todo: board.querySelector('.todos-column[data-state="todo"] .todos-column-list'),
      in_progress: board.querySelector('.todos-column[data-state="in_progress"] .todos-column-list'),
      in_review: board.querySelector('.todos-column[data-state="in_review"] .todos-column-list'),
      done: board.querySelector('.todos-column[data-state="done"] .todos-column-list'),
    };

    // Clear columns
    Object.values(columns).forEach(el => { if (el) el.innerHTML = ''; });

    // Place todos into columns
    todos.forEach(t => {
      const state = t.status || 'todo';
      const col = columns[state] || columns.todo;
      const name = t.name || '';
      const desc = (t.description && t.description.substring(0,120)) || '';
      const owner = (t.owner_id && t.owner_id[1]) ? t.owner_id[1] : '';
      const card = document.createElement('div');
      card.className = 'todo-card mi90--card';
      card.style.marginBottom = '8px';
      card.dataset.id = t.id;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:600">${name}</div>
          <div style="font-size:12px;color:var(--muted)">${owner}</div>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-top:6px">${desc}</div>
        <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:8px">
          <button class="mi90-todo-btn mi90-todo-prev" data-id="${t.id}">◀</button>
          <button class="mi90-todo-btn mi90-todo-next" data-id="${t.id}">▶</button>
          <button class="mi90-todo-btn mi90-todo-edit" data-id="${t.id}">✎</button>
          <button class="mi90-todo-btn mi90-todo-delete" data-id="${t.id}" title="Eliminar">🗑</button>
        </div>
      `;
      if (col) col.appendChild(card);
    });

    // Update column counts
    ['todo','in_progress','in_review','done'].forEach(s => {
      const badge = rootEl.querySelector(`.mi90-todos-count-${s}`);
      const count = todos.filter(t => (t.status||'todo') === s).length;
      if (badge) badge.textContent = count;
    });

    // Attach handlers for add button
    const addBtn = rootEl.querySelector('.mi90-todo-add-btn');
    const addInput = rootEl.querySelector('.mi90-todo-new-input');
    if (addBtn && addInput) {
      addBtn.onclick = async (ev) => {
        const name = (addInput.value || '').trim();
        if (!name) return;
        addBtn.disabled = true;
        try {
          await this.fetchJson('/mi90_eos/data/todos/create', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name: name, status: 'todo'})});
          addInput.value = '';
          await this.fetchAndRenderTodos();
        } catch(e) {
          console.error('todo create failed', e);
        } finally { addBtn.disabled = false; }
      };
    }

    // Attach handlers for move buttons
    rootEl.querySelectorAll('.mi90-todo-prev').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const id = ev.currentTarget.dataset.id;
        await this._changeTodoStateByDelta(id, -1);
      });
    });
    rootEl.querySelectorAll('.mi90-todo-next').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const id = ev.currentTarget.dataset.id;
        await this._changeTodoStateByDelta(id, +1);
      });
    });
    // edit button currently refreshes (placeholder)
    rootEl.querySelectorAll('.mi90-todo-edit').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const id = ev.currentTarget.dataset.id;
        // simple toggle to done as quick action
        try {
          await this.fetchJson('/mi90_eos/data/todos/update', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id: id, status: 'done'})});
          await this.fetchAndRenderTodos();
        } catch(e) { console.error('todo edit failed', e); }
      });
    });
  }

  // Change todo state by advancing/retreating through the workflow
  async _changeTodoStateByDelta(id, delta) {
    // ordered states
    const order = ['todo','in_progress','in_review','done'];
    try {
      // fetch current record to know state
      const res = await this.fetchJson('/mi90_eos/data/todos');
      const todos = res.todos || [];
      const t = todos.find(x => String(x.id) === String(id));
      if (!t) return;
      const cur = t.status || 'todo';
      let idx = order.indexOf(cur);
      if (idx === -1) idx = 0;
      let newIdx = Math.min(order.length-1, Math.max(0, idx + delta));
      const newState = order[newIdx];
      await this.fetchJson('/mi90_eos/data/todos/update', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id: id, status: newState})});
      await this.fetchAndRenderTodos();
    } catch(e) {
      console.error('change todo state failed', e);
    }
  }

  async fetchAndRenderScorecard() {
    const rootEl = this.rootRef.el || this.el;
    try {
      const data = await this.fetchJson('/mi90_eos/data/scorecard');
      const s = data.scorecard || {};
      this.renderScorecard(rootEl, s);
    } catch(e) {
      console.warn('Unable to load scorecard', e);
    }
  }

  renderScorecard(rootEl, s) {
    const wrapper = rootEl.querySelector('.scorecard--wrap');
    if (!wrapper) return;
    const headerRight = wrapper.querySelector('.scorecard--wrap > div:nth-child(1) > div:nth-child(2)');
    if (headerRight) {
      headerRight.textContent = `Resumen — Total:${s.total||0} · Hechas:${s.done||0} · En Progreso:${s.in_progress||0} · Atrasadas:${s.overdue||0}`;
    }
  }

  async fetchAndRenderIssues() {
    const rootEl = this.rootRef.el || this.el;
    try {
      const data = await this.fetchJson('/mi90_eos/data/issues');
      const items = data.issues || [];
      this.renderIssues(rootEl, items);
    } catch(e){/* ignore */}
  }

  renderIssues(rootEl, items) {
    const list = rootEl.querySelector('.issues--list');
    if (!list) return;
    list.innerHTML = items.map(i => `<li>${i.name || ''} <small style="color:var(--muted)">${i.priority||''}</small></li>`).join('');
  }

  async fetchAndRenderMeetings() {
    const rootEl = this.rootRef.el || this.el;
    try {
      const data = await this.fetchJson('/mi90_eos/data/meetings');
      const items = data.meetings || [];
      this.renderMeetings(rootEl, items);
    } catch(e){/* ignore */}
  }

  renderMeetings(rootEl, items) {
    const list = rootEl.querySelector('.meetings--list');
    if (!list) return;
    list.innerHTML = items.map(m => `<li>${m.name||''} <small style="color:var(--muted)">${m.date||''}</small></li>`).join('');
  }

  setupNavigation() {
    const rootEl = this.rootRef.el || this.el;
    if (!rootEl) return;
    
    const navButtons = rootEl.querySelectorAll('.mi90--nav-btn');
    
    navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover clase active de todos los botones
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        // Obtener la vista seleccionada
        const view = button.dataset.view;
        
        if (view === 'scorecard') {
          // Mostrar solo la card del scorecard expandida
          this.showScorecardView(rootEl);
        } else if (view === 'rocas') {
          // Mostrar solo la card de rocas expandida
          this.showRocasView(rootEl);
        } else {
          // Mostrar vista Mi 90 normal
          this.showMi90View(rootEl);
        }
      });
    });
  }

  showScorecardView(rootEl) {
    const grid = rootEl.querySelector('.mi90--grid');
    if (grid) {
      grid.style.gridTemplateColumns = '1fr';
      
      // Ocultar otras cards
      const row = rootEl.querySelector('.mi90--row');
      if (row) {
        row.style.display = 'none';
      }
      
      // Expandir scorecard
      const scorecardCard = rootEl.querySelector('.mi90--scorecard');
      if (scorecardCard) {
        scorecardCard.style.gridColumn = '1';
      }
    }
  }

  showMi90View(rootEl) {
    const grid = rootEl.querySelector('.mi90--grid');
    if (grid) {
      grid.style.gridTemplateColumns = 'repeat(2,1fr)';
      
      // Restaurar todas las cards
      const scorecardCard = rootEl.querySelector('.mi90--scorecard');
      const todosCard = rootEl.querySelector('.mi90--todos');
      const rocasCard = rootEl.querySelector('.mi90--rocks');
      const chartCard = rootEl.querySelector('.mi90--chart');
      
      if (scorecardCard) {
        scorecardCard.style.display = 'block';
        scorecardCard.style.gridColumn = 'auto';
      }
      if (todosCard) todosCard.style.display = 'block';
      if (rocasCard) rocasCard.style.display = 'block';
      if (chartCard) chartCard.style.display = 'block';
      
      // Restaurar el row
      const row = rootEl.querySelector('.mi90--row');
      if (row) {
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr 1fr 1fr';
      }
    }
  }

  showRocasView(rootEl) {
    const grid = rootEl.querySelector('.mi90--grid');
    if (grid) {
      grid.style.gridTemplateColumns = '1fr';
      
      // Ocultar scorecard
      const scorecardCard = rootEl.querySelector('.mi90--scorecard');
      if (scorecardCard) {
        scorecardCard.style.display = 'none';
      }
      
      // Ocultar otras cards del row
      const todosCard = rootEl.querySelector('.mi90--todos');
      const chartCard = rootEl.querySelector('.mi90--chart');
      if (todosCard) todosCard.style.display = 'none';
      if (chartCard) chartCard.style.display = 'none';
      
      // Expandir solo la card de rocas
      const rocasCard = rootEl.querySelector('.mi90--rocks');
      if (rocasCard) {
        rocasCard.style.display = 'block';
        rocasCard.style.gridColumn = '1';
      }
      
      // Mostrar el row pero solo con rocas
      const row = rootEl.querySelector('.mi90--row');
      if (row) {
        row.style.display = 'block';
        row.style.gridTemplateColumns = '1fr';
      }
    }
  }
}

registry.category("actions").add("mi90_eos.dashboard_action", Mi90DashboardAction);

// NOTE: The legacy Mi90TodosAction (fetch-based) was removed to avoid duplicate
// registrations for the `mi90_eos.todo_board` action. The OWL implementation
// is present in `static/src/js/todo_board.js` and is the one that should be used.
