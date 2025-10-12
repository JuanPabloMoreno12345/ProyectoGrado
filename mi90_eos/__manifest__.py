# -*- coding: utf-8 -*-
{
    'name': 'Mi 90 EOS Dashboard',
    'version': '1.0.0',
    'category': 'Productivity',
    'summary': 'Dashboard EOS (Entrepreneurial Operating System) para gestión empresarial',
    'description': """
        Módulo EOS Dashboard
        ===================
        
        Este módulo proporciona un dashboard completo para la implementación del 
        Sistema Operativo Empresarial (EOS) con las siguientes funcionalidades:
        
        * Mi 90 - Dashboard principal
        * Scorecard - Métricas y KPIs
        * Rocas - Objetivos trimestrales
        * To-Dos - Lista de tareas
        * Problemas - Gestión de issues
        * Reuniones - Calendario de reuniones EOS
        * Titulares - Noticias y comunicaciones
        * V/TO® - Visión, Tracción, Organización
        * Organigrama de Responsabilidades
        * 1-a-1 - Reuniones individuales
        * Proceso - Documentación de procesos
        * Directorio - Contactos del equipo
        * EOS Toolbox™ - Herramientas adicionales
    """,
    'author': 'Tu Nombre',
    'website': 'https://www.tuempresa.com',
    'depends': ['base', 'web'],
    'data': [
        'views/eos_dashboard_views.xml',
        'views/eos_menu.xml',
        'security/ir.model.access.csv',
    ],
    'assets': {
        'web.assets_backend': [
            'mi90_eos/static/src/css/styles.css',
            'mi90_eos/static/src/js/app.js',
            'mi90_eos/static/src/js/dashboard_action.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}