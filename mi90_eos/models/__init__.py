# -*- coding: utf-8 -*-

from odoo import models, fields, api

class EOSDashboard(models.Model):
    _name = 'eos.dashboard'
    _description = 'EOS Dashboard'
    
    name = fields.Char(string='Nombre', required=True)
    description = fields.Text(string='Descripción')
    active = fields.Boolean(string='Activo', default=True)
