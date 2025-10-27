from odoo import models, fields, api


class EosIssue(models.Model):
    _name = 'eos.issue'
    _description = 'EOS Issue'

    name = fields.Char(string='Title', required=True, index=True)
    description = fields.Text(string='Description')
    priority = fields.Selection([('low','Low'),('medium','Medium'),('high','High')], default='medium')
    resolved = fields.Boolean(string='Resolved', default=False)
    owner_id = fields.Many2one('res.users', string='Owner', ondelete='set null')
    created_at = fields.Datetime(string='Created At', readonly=True, default=fields.Datetime.now)
    updated_at = fields.Datetime(string='Updated At', readonly=True)

    def write(self, vals):
        res = super().write(vals)
        for r in self:
            r.updated_at = fields.Datetime.now()
        return res
