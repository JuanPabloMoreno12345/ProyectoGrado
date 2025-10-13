{
    "name": "EOS DATA",
    "summary": "Frontend de dashboard EOS DATA (Mi 90) — solo interfaz",
    "version": "1.0.0",
    "category": "Productivity",
    "author": "Tu Empresa",
    "website": "https://example.com",
    "license": "LGPL-3",
    "depends": ["base", "web"],
    "data": [
        "views/eos_action_menu.xml"
    ],
    "assets": {
        "web.assets_backend": [
            "mi90_eos/static/src/css/dashboard.css",
            "mi90_eos/static/src/xml/dashboard.xml",
            "mi90_eos/static/src/js/dashboard_action.js"
        ]
    },
    "installable": True,
    "application": True
}
