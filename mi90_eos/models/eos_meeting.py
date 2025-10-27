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
