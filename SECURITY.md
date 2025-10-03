# Política de Seguridad

## Versiones Soportadas

Actualmente, estamos dando soporte de seguridad a las siguientes versiones de Impostores:

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reportar una Vulnerabilidad

La seguridad de Impostores es una prioridad. Si descubres una vulnerabilidad de seguridad, te pedimos que nos ayudes a mantener el proyecto seguro siguiendo estos pasos:

### 📧 Cómo Reportar

1. **NO** abras un issue público en GitHub para vulnerabilidades de seguridad
2. Envía un correo electrónico detallado a través de GitHub Issues marcado como "Security"
3. Incluye la siguiente información:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Versión afectada
   - Impacto potencial
   - Sugerencias de solución (si las tienes)

### ⏱️ Tiempo de Respuesta

- **Confirmación inicial**: Dentro de 48 horas
- **Evaluación de la vulnerabilidad**: Dentro de 7 días
- **Corrección y parche**: Depende de la severidad
  - Crítica: 1-3 días
  - Alta: 7-14 días
  - Media: 14-30 días
  - Baja: 30-60 días

### 🔒 Proceso de Divulgación

1. Recibirás una confirmación de que hemos recibido tu reporte
2. Evaluaremos la vulnerabilidad y su impacto
3. Desarrollaremos y probaremos una solución
4. Lanzaremos un parche de seguridad
5. Publicaremos un aviso de seguridad (si es necesario)
6. Te acreditaremos por el descubrimiento (si lo deseas)

## 🛡️ Mejores Prácticas de Seguridad

### Para Usuarios

- **Mantén actualizado**: Usa siempre la última versión de Impostores
- **Conexión segura**: Usa HTTPS en producción
- **Códigos de sala**: No compartas códigos de sala públicamente
- **Información personal**: No compartas información sensible en el chat

### Para Desarrolladores

- **Dependencias**: Mantén todas las dependencias actualizadas
- **Validación**: Valida todas las entradas del usuario
- **Sanitización**: Sanitiza los mensajes del chat para prevenir XSS
- **Rate Limiting**: Implementa límites de tasa para prevenir abuso
- **Logs**: No registres información sensible en los logs

## 🔐 Medidas de Seguridad Implementadas

### Servidor (Node.js)

- ✅ Validación de entrada en todos los eventos de Socket.IO
- ✅ Límites de longitud para nombres y mensajes
- ✅ Gestión segura de salas y códigos
- ✅ Limpieza automática de salas vacías
- ✅ Prevención de inyección de código en mensajes

### Cliente (Frontend)

- ✅ Sanitización de HTML en mensajes de chat
- ✅ Validación de entrada en formularios
- ✅ Límites de caracteres en inputs
- ✅ Manejo seguro de eventos del DOM

### Comunicación

- ✅ WebSockets con Socket.IO
- ⚠️ **Recomendado para producción**: Implementar HTTPS/WSS
- ⚠️ **Recomendado para producción**: Implementar autenticación adicional

## 🚨 Vulnerabilidades Conocidas

Actualmente no hay vulnerabilidades conocidas en la versión 1.0.x.

## 📋 Historial de Seguridad

### Versión 1.0.0 (2024)
- Lanzamiento inicial con medidas de seguridad básicas implementadas
- Validación de entrada implementada
- Sanitización de mensajes implementada

## 🔄 Actualizaciones de Seguridad

Para mantenerte informado sobre actualizaciones de seguridad:

1. Sigue el repositorio en GitHub
2. Activa las notificaciones de releases
3. Revisa regularmente el archivo SECURITY.md

## ⚠️ Descargo de Responsabilidad

Este software se proporciona "tal cual", sin garantía de ningún tipo. Los desarrolladores no son responsables de ningún daño o pérdida de datos que pueda ocurrir por el uso de este software.

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Socket.IO Security](https://socket.io/docs/v4/security/)

## 🙏 Agradecimientos

Agradecemos a todos los investigadores de seguridad y contribuyentes que ayudan a mantener Impostores seguro.

---

Última actualización: 2024