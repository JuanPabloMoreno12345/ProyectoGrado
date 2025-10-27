from odoo import models, fields, api


class EosRock(models.Model):
    _name = 'eos.rock'
    _description = 'EOS Rock'

    name = fields.Char(string='Title', required=True, index=True)
    description = fields.Text(string='Description')
    owner_id = fields.Many2one('res.users', string='Owner', ondelete='set null', index=True)
    due_date = fields.Date(string='Due Date', index=True)
    status = fields.Selection([
        ('draft', 'Draft'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', default='draft', index=True)
    progress = fields.Float(string='Progress', compute='_compute_progress', store=True, group_operator='avg')
    key_result_ids = fields.One2many('eos.key_result', 'rock_id', string='Key Results')

    date_create = fields.Datetime(string='Created At', readonly=True, default=fields.Datetime.now)
    date_update = fields.Datetime(string='Updated At', readonly=True)

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        for r in records:
            r._compute_progress()
        return records

    def write(self, vals):
        res = super().write(vals)
        # Recompute progress for affected rocks
        if any(k in vals for k in ('name', 'description', 'status', 'owner_id', 'due_date')):
            for r in self:
                r._compute_progress()
        return res

    @api.depends('key_result_ids.current_value', 'key_result_ids.target_value', 'key_result_ids.weight')
    def _compute_progress(self):
        for rock in self:
            krs = rock.key_result_ids
            if not krs:
                rock.progress = 0.0
                continue
            total_weight = sum(kr.weight or 1.0 for kr in krs)
            if total_weight == 0:
                rock.progress = 0.0
                continue
            score = 0.0
            for kr in krs:
                try:
                    percent = (float(kr.current_value) / float(kr.target_value)) * 100.0 if kr.target_value else 0.0
                except Exception:
                    percent = 0.0
                w = kr.weight or 1.0
                score += percent * w
            rock.progress = round(score / total_weight, 2)
