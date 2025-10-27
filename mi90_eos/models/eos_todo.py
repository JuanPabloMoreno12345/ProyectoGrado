from odoo import models, fields, api


class EosTodo(models.Model):
    _name = 'eos.todo'
    _description = 'EOS Todo'

    name = fields.Char(string='Task', required=True)
    assigned_to = fields.Many2one('res.users', string='Assigned to', ondelete='set null')
    due_date = fields.Date(string='Due Date')
    done = fields.Boolean(string='Done', default=False)
    rock_id = fields.Many2one('eos.rock', string='Related Rock', ondelete='set null')
    note = fields.Text(string='Note')

    _sql_constraints = [
        ('name_not_empty', 'CHECK (char_length(name) > 0)', 'Task name must not be empty')
    ]
