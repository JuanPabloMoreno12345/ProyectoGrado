# INSTRUCCIONES PARA SOLUCIONAR EL ERROR DEL MÓDULO EOS

## Problema:
Error: "Cannot find mi90_eos.dashboard_action in this registry!"

## Solución paso a paso:

### 1. DETENER EL SERVIDOR ODOO
- Cierra completamente el servidor Odoo

### 2. LIMPIAR CACHÉ Y REINSTALAR
Ejecuta estos comandos en la terminal (reemplaza 'tu_base_de_datos' con el nombre de tu base de datos):

```bash
# Actualizar el módulo
python odoo-bin -d tu_base_de_datos -u mi90_eos --stop-after-init

# Si el comando anterior no funciona, desinstalar y reinstalar:
python odoo-bin -d tu_base_de_datos -u mi90_eos --stop-after-init
python odoo-bin -d tu_base_de_datos -i mi90_eos --stop-after-init
```

### 3. INICIAR ODOO NORMALMENTE
```bash
python odoo-bin -d tu_base_de_datos
```

### 4. VERIFICAR EN LA INTERFAZ WEB
- Ve a Apps
- Busca "Mi 90 EOS Dashboard"
- Si aparece como "Instalado", haz clic en "Actualizar"
- Si aparece como "No instalado", haz clic en "Instalar"

### 5. PROBAR EL MÓDULO
- Ve al menú principal de Odoo
- Busca "EOS Dashboard"
- Haz clic en "Mi 90"

## Si el problema persiste:

### Opción A: Limpiar completamente
1. Desinstala el módulo desde Apps
2. Elimina la carpeta del módulo: `C:\mi_odoo_addons\mi90_eos`
3. Copia nuevamente todos los archivos del módulo
4. Reinstala desde Apps

### Opción B: Verificar archivos
Asegúrate de que estos archivos existan:
- `C:\mi_odoo_addons\mi90_eos\__manifest__.py`
- `C:\mi_odoo_addons\mi90_eos\__init__.py`
- `C:\mi_odoo_addons\mi90_eos\views\eos_menu.xml`
- `C:\mi_odoo_addons\mi90_eos\controllers\main.py`

## URLs de prueba directa:
Si el menú no funciona, puedes probar directamente estas URLs:
- http://localhost:8069/eos/dashboard
- http://localhost:8069/eos/scorecard
- http://localhost:8069/eos/rocks
- etc.
