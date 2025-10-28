from odoo import models, fields, api


class EosMeeting(models.Model):
    _name = 'eos.meeting'
    _description = 'EOS Meeting (L10)'

    name = fields.Char(string='Title', required=True)
    date = fields.Date(string='Date', default=fields.Date.context_today)
    attendees = fields.Many2many('res.users', string='Attendees')
    notes = fields.Text(string='Notes')
    decisions = fields.Text(string='Decisions')
    created_at = fields.Datetime(string='Created At', readonly=True, default=fields.Datetime.now)
    # Roles sugeridos en L10
    integrator_id = fields.Many2one('res.users', string='Integrador')
    time_keeper_id = fields.Many2one('res.users', string='Time Keeper')
    # Lista de chequeo previa a la reunión
    precheck_scorecard = fields.Boolean(string='Scorecard actualizado')
    precheck_rocks = fields.Boolean(string='Rocas actualizadas')
    precheck_todos = fields.Boolean(string='To-Dos revisados')
    # Puntuación de la reunión (0-10)
    score = fields.Integer(string='Puntuación (0-10)', default=10)
    todo_ids = fields.One2many('eos.todo', 'meeting_id', string='To-Dos')
    todo_count = fields.Integer(string='To-Dos', compute='_compute_todo_count')

    def _compute_todo_count(self):
        for rec in self:
            rec.todo_count = len(rec.todo_ids)

    def action_view_todos(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': 'To-Do',
            'res_model': 'eos.todo',
            'view_mode': 'kanban,tree,form',
            'domain': [('meeting_id', '=', self.id)],
            'context': {
                'default_meeting_id': self.id,
                'search_default_pending': 1,
            },
            'target': 'current',
        }
