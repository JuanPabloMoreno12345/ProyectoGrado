from odoo import http, fields
from odoo.http import request
import json

class Mi90EosController(http.Controller):
    @http.route('/mi90_eos/data/rocks', type='http', auth='user', methods=['GET'], csrf=False)
    def rocks(self, **kw):
        rocks = request.env['eos.rock'].sudo().search_read([], ['id', 'name', 'description', 'owner_id', 'due_date', 'status', 'progress'])
        return request.make_response(json.dumps({'success': True, 'rocks': rocks}), headers=[('Content-Type', 'application/json')])

    @http.route('/mi90_eos/data/key_results', type='http', auth='user', methods=['GET'], csrf=False)
    def key_results(self, **kw):
        krs = request.env['eos.key_result'].sudo().search_read([], ['id', 'name', 'rock_id', 'target_value', 'current_value', 'unit', 'weight', 'status'])
        return request.make_response(json.dumps({'success': True, 'key_results': krs}), headers=[('Content-Type', 'application/json')])

    @http.route('/mi90_eos/data/todos', type='http', auth='user', methods=['GET'], csrf=False)
    def todos(self, **kw):
        # Provide fields matching the eos.todo model
        todos = request.env['eos.todo'].sudo().search_read([], ['id', 'name', 'description', 'owner_id', 'due_date', 'status', 'progress', 'rock_id'])
        return request.make_response(json.dumps({'success': True, 'todos': todos}), headers=[('Content-Type', 'application/json')])

    @http.route('/mi90_eos/data/scorecard', type='http', auth='user', methods=['GET'], csrf=False)
    def scorecard(self, **kw):
        # Minimal scorecard payload (frontend can compute labels)
        rocks = request.env['eos.rock'].sudo().search([])
        total = len(rocks)
        done = sum(1 for r in rocks if r.progress and r.progress >= 100)
        in_progress = sum(1 for r in rocks if r.progress and 0 < r.progress < 100)
        overdue = sum(1 for r in rocks if r.due_date and r.due_date < fields.Date.context_today(request.env))
        payload = {
            'total': total,
            'done': done,
            'in_progress': in_progress,
            'overdue': overdue,
        }
        return request.make_response(json.dumps({'success': True, 'scorecard': payload}), headers=[('Content-Type', 'application/json')])

    # Key Results CRUD
    @http.route('/mi90_eos/data/key_results/create', type='json', auth='user')
    def create_key_result(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        kr = request.env['eos.key_result'].sudo().create(vals)
        return {'success': True, 'id': kr.id}

    @http.route('/mi90_eos/data/key_results/update', type='json', auth='user')
    def update_key_result(self, **data):
        kr_id = data.get('id')
        if not kr_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        kr = request.env['eos.key_result'].sudo().browse(int(kr_id))
        if not kr.exists():
            return {'success': False, 'error': 'not found'}
        kr.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/key_results/delete', type='json', auth='user')
    def delete_key_result(self, **data):
        kr_id = data.get('id')
        if not kr_id:
            return {'success': False, 'error': 'missing id'}
        kr = request.env['eos.key_result'].sudo().browse(int(kr_id))
        if not kr.exists():
            return {'success': False, 'error': 'not found'}
        kr.unlink()
        return {'success': True}

    # Issues CRUD
    @http.route('/mi90_eos/data/issues/create', type='json', auth='user')
    def create_issue(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        rec = request.env['eos.issue'].sudo().create(vals)
        return {'success': True, 'id': rec.id}

    @http.route('/mi90_eos/data/issues/update', type='json', auth='user')
    def update_issue(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        rec = request.env['eos.issue'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/issues/delete', type='json', auth='user')
    def delete_issue(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        rec = request.env['eos.issue'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.unlink()
        return {'success': True}

    # Meetings CRUD
    @http.route('/mi90_eos/data/meetings/create', type='json', auth='user')
    def create_meeting(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        rec = request.env['eos.meeting'].sudo().create(vals)
        return {'success': True, 'id': rec.id}

    @http.route('/mi90_eos/data/meetings/update', type='json', auth='user')
    def update_meeting(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        rec = request.env['eos.meeting'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/meetings/delete', type='json', auth='user')
    def delete_meeting(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        rec = request.env['eos.meeting'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.unlink()
        return {'success': True}

    # Import skeleton endpoint (to be implemented)
    @http.route('/mi90_eos/data/import_xlsx', type='http', auth='user', methods=['POST'], csrf=False)
    def import_xlsx(self, **kw):
        return request.make_response(json.dumps({'success': False, 'error': 'import not implemented yet'}), headers=[('Content-Type', 'application/json')])

    # KPIs CRUD
    @http.route('/mi90_eos/data/kpis/create', type='json', auth='user')
    def create_kpi(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        rec = request.env['eos.kpi'].sudo().create(vals)
        return {'success': True, 'id': rec.id}

    @http.route('/mi90_eos/data/kpis/update', type='json', auth='user')
    def update_kpi(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        rec = request.env['eos.kpi'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/kpis/delete', type='json', auth='user')
    def delete_kpi(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        rec = request.env['eos.kpi'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.unlink()
        return {'success': True}

    # KPI values CRUD
    @http.route('/mi90_eos/data/kpi_values/create', type='json', auth='user')
    def create_kpi_value(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        rec = request.env['eos.kpi.value'].sudo().create(vals)
        return {'success': True, 'id': rec.id}

    @http.route('/mi90_eos/data/kpi_values/update', type='json', auth='user')
    def update_kpi_value(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        rec = request.env['eos.kpi.value'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/kpi_values/delete', type='json', auth='user')
    def delete_kpi_value(self, **data):
        rec_id = data.get('id')
        if not rec_id:
            return {'success': False, 'error': 'missing id'}
        rec = request.env['eos.kpi.value'].sudo().browse(int(rec_id))
        if not rec.exists():
            return {'success': False, 'error': 'not found'}
        rec.unlink()
        return {'success': True}

    @http.route('/mi90_eos/data/rocks/create', type='json', auth='user')
    def create_rock(self, **data):
        # Expect a JSON object with fields for eos.rock
        vals = {k: v for k, v in data.items() if k != 'id'}
        rock = request.env['eos.rock'].sudo().create(vals)
        return {'success': True, 'id': rock.id}

    @http.route('/mi90_eos/data/rocks/update', type='json', auth='user')
    def update_rock(self, **data):
        rock_id = data.get('id')
        if not rock_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        rock = request.env['eos.rock'].sudo().browse(int(rock_id))
        if not rock.exists():
            return {'success': False, 'error': 'not found'}
        rock.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/rocks/delete', type='json', auth='user')
    def delete_rock(self, **data):
        rock_id = data.get('id')
        if not rock_id:
            return {'success': False, 'error': 'missing id'}
        rock = request.env['eos.rock'].sudo().browse(int(rock_id))
        if not rock.exists():
            return {'success': False, 'error': 'not found'}
        rock.unlink()
        return {'success': True}

    @http.route('/mi90_eos/data/todos/create', type='json', auth='user')
    def create_todo(self, **data):
        vals = {k: v for k, v in data.items() if k != 'id'}
        todo = request.env['eos.todo'].sudo().create(vals)
        return {'success': True, 'id': todo.id}

    @http.route('/mi90_eos/data/todos/update', type='json', auth='user')
    def update_todo(self, **data):
        todo_id = data.get('id')
        if not todo_id:
            return {'success': False, 'error': 'missing id'}
        vals = {k: v for k, v in data.items() if k not in ('id',)}
        todo = request.env['eos.todo'].sudo().browse(int(todo_id))
        if not todo.exists():
            return {'success': False, 'error': 'not found'}
        todo.write(vals)
        return {'success': True}

    @http.route('/mi90_eos/data/todos/delete', type='json', auth='user')
    def delete_todo(self, **data):
        todo_id = data.get('id')
        if not todo_id:
            return {'success': False, 'error': 'missing id'}
        todo = request.env['eos.todo'].sudo().browse(int(todo_id))
        if not todo.exists():
            return {'success': False, 'error': 'not found'}
        todo.unlink()
        return {'success': True}
