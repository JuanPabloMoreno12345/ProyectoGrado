from odoo import models, fields, api


class EosTodo(models.Model):
    _name = 'eos.todo'
    _description = 'EOS To-Do'

    name = fields.Char(string='Title', required=True, index=True)
    description = fields.Text(string='Description')
    owner_id = fields.Many2one('res.users', string='Owner', ondelete='set null', index=True)
    due_date = fields.Date(string='Due Date', index=True)
    status = fields.Selection([
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', default='todo', index=True)
    progress = fields.Float(string='Progress', compute='_compute_progress', store=True, group_operator='avg')
    rock_id = fields.Many2one('eos.rock', string='Related Rock', ondelete='set null')

    date_create = fields.Datetime(string='Created At', readonly=True, default=fields.Datetime.now)
    date_update = fields.Datetime(string='Updated At', readonly=True)

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        for r in records:
            r._compute_progress()
        return records

    def write(self, vals):
        vals['date_update'] = fields.Datetime.now()
        res = super().write(vals)
        # Recompute progress when status or other fields change
        if any(k in vals for k in ('name', 'description', 'status', 'owner_id', 'due_date')):
            for r in self:
                r._compute_progress()
        return res

    @api.depends('status')
    def _compute_progress(self):
        for todo in self:
            if todo.status == 'done':
                todo.progress = 100.0
            elif todo.status == 'in_progress':
                todo.progress = 50.0
            elif todo.status == 'cancel':
                todo.progress = 0.0
            else:
                todo.progress = 0.0

    _sql_constraints = [
        ('name_not_empty', 'CHECK (char_length(name) > 0)', 'Task name must not be empty')
    ]
