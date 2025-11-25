# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



===============================================================================================================
Chatbot:
Pagina nueva de Asistente virtual:
<?php

/**
 * Template Name: Chat Full (Krear3D)
 * Description: Vista completa del chat para asesoría virtual.
 */
defined('ABSPATH') || exit;

get_header();

?>
<!-- Chat Full Template Markup (WordPress-ready) -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Asesoría Virtual</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: #F0F0F0;
      /* Fondo gris claro */
      color: #333;
      line-height: 1.5;
    }



    /* === CONTENEDOR BLANCO DEL CHAT === */
    #chat-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 960px;
      margin: 20px auto;
      display: flex;
      flex-direction: column;
      height: calc(90vh - 140px);
      overflow: hidden;
    }

    /* === CONTENIDO DEL CHAT === */
    #chatbot-modal {
      display: flex !important;
      flex-direction: column;
      height: 100%;
      background: #fff;
      flex: 1;
    }

    #chat-box {
      flex: 1;
      overflow-y: auto;
      padding: 32px 24px 24px;
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
      background: #fff;
    }

    .message {
      margin-bottom: 32px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .message.user-message {
      justify-content: flex-end;
    }

    .message.user-message .message-bubble {
      background: #f0f0f0;
      margin-left: 0;
    }

    .bot-avatar {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: #dbdbdbff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #e5e5e5;
      flex-shrink: 0;
    }

    .message-bubble {
      background: white;
      padding: 16px 20px;
      border-radius: 8px;
      max-width: 750px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      border: 1px solid #f0f0f0;
    }

    .user-message .message-bubble {
      background: #ededed;
      border: none;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .message-text {
      color: #333;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    #chat-input {
      padding: 16px 24px;
      background: #fff;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: center;
    }

    .input-wrapper {
      display: flex;
      gap: 12px;
      max-width: 900px;
      width: 100%;
      align-items: flex-end;
    }

    #user-input {
      flex: 1;
      border: 1px solid #d0d0d0;
      border-radius: 24px;
      padding: 12px 20px;
      font-size: 15px;
      font-family: inherit;
      resize: none;
      outline: none;
      background: #f9f9f9;
      color: #333;
      line-height: 1.5;
      min-height: 46px;
      max-height: 120px;
    }

    #user-input:focus {
      border-color: #999;
      background: white;
    }

    #send-btn {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: none;
      background: #e0e0e0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    #send-btn:hover {
      background: #d0d0d0;
    }

    #send-btn:active {
      transform: scale(0.95);
    }

    .send-icon {
      width: 20px;
      height: 20px;
      opacity: 0.6;
    }

    .typing-dots {
      display: inline-flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      background: #bbb;
      border-radius: 50%;
      display: inline-block;
      animation: blink 1.4s infinite both;
    }

    @keyframes blink {
      0% {
        opacity: 0.2;
        transform: translateY(0);
      }

      20% {
        opacity: 1;
        transform: translateY(-2px);
      }

      100% {
        opacity: 0.2;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      #chat-container {
        margin: 10px;
        height: calc(100vh - 120px);
      }

      #chat-box {
        padding: 20px 16px;
      }

      #chat-input {
        padding: 12px 16px 16px;
      }

      .message-bubble {
        max-width: 100%;
      }
    }
  </style>

  <!-- === NUEVO CONTENEDOR BLANCO DEL CHAT === -->
  <div id="chat-container">
    <div id="chatbot-modal"
      data-avatar-bot="<?php echo esc_url($bot_avatar); ?>"
      data-avatar-user="<?php echo esc_url($user_avatar); ?>"
      data-base-url="<?php echo esc_url($home_url); ?>"
      data-api-url="<?php echo esc_url($api_url); ?>">

      <div id="chat-box"></div>

      <div id="chat-input">
        <div class="input-wrapper">
          <textarea id="user-input" placeholder="En qué te puedo ayudar el día de hoy?" rows="1"></textarea>
          <button id="send-btn" aria-label="Enviar">
            <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const modalEl = document.getElementById('chatbot-modal');
    const BASE_URL = modalEl.dataset.baseUrl || window.location.origin;
    // === Configuración (editar aquí) ===
    // API del chatbot:
    // - En desarrollo local usa http://localhost:3000
    // - En producción puedes usar el proxy de WP:
    //   const API_URL = '/wp-json/krear3d/v1/chatbot-api' / despliegue : https://bot-core.krear3d.com
    const API_BASE = 'https://bot-core.krear3d.com';
    const API_URL = `${API_BASE}/chatbot-api`;
    const HEALTH_URL = `${API_BASE}/health`;
    // Detectar si es un refresco de página - en ambos entornos se resetea la memoria al refrescar
    const isPageLoad = performance.getEntriesByType('navigation')[0]?.type === 'reload' || 
                      performance.getEntriesByType('navigation')[0]?.type === 'navigate';
    
    let sessionId;
    if (isPageLoad) {
        // Siempre crear nueva sesión al refrescar la página (en ambos entornos)
        sessionId = crypto.randomUUID();
        localStorage.setItem("chatSessionId", sessionId);
        console.log("🔄 Nueva sesión creada (refresco de página)");
    } else {
        // Mantener sesión existente o crear nueva
        sessionId = localStorage.getItem("chatSessionId") || crypto.randomUUID();
        localStorage.setItem("chatSessionId", sessionId);
    }

    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function scrollToBottom() {
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // === Avatares (editar aquí) ===
    // Rutas de imágenes para el bot y el usuario.
    // Puedes pegarlas desde la Biblioteca de Medios de WordPress.
    const BOT_AVATAR = 'https://dev.tiendakrear3d.com/wp-content/uploads/2025/11/chatbot.webp';
    const USER_AVATAR = 'https://dev.tiendakrear3d.com/wp-content/uploads/2025/11/user.webp';

    function crearMensajeUsuario(texto) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user-message';
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      const textEl = document.createElement('div');
      textEl.className = 'message-text';
      textEl.innerHTML = escapeHtml(texto);
      bubble.appendChild(textEl);
      const img = document.createElement('img');
      img.src = USER_AVATAR;
      img.alt = 'Usuario';
      img.className = 'avatar user-avatar';
      messageDiv.appendChild(bubble);
      messageDiv.appendChild(img);
      chatBox.appendChild(messageDiv);
      scrollToBottom();
    }

    function crearMensajeBot(texto) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      const img = document.createElement('img');
      img.src = BOT_AVATAR;
      img.alt = 'Chatbot';
      img.className = 'avatar bot-avatar';
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      const textEl = document.createElement('div');
      textEl.className = 'message-text';
      textEl.innerHTML = escapeHtml(texto);
      bubble.appendChild(textEl);
      messageDiv.appendChild(img);
      messageDiv.appendChild(bubble);
      chatBox.appendChild(messageDiv);
      scrollToBottom();
    }

    // Muestra un mensaje del bot con animación de puntos "pensando"
    function mostrarPensando() {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      const img = document.createElement('img');
      img.src = BOT_AVATAR;
      img.alt = 'Chatbot';
      img.className = 'avatar bot-avatar';
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      const dots = document.createElement('div');
      dots.className = 'typing-dots';
      dots.innerHTML = '<span></span><span></span><span></span>';
      bubble.appendChild(dots);
      messageDiv.appendChild(img);
      messageDiv.appendChild(bubble);
      chatBox.appendChild(messageDiv);
      scrollToBottom();
      return messageDiv; // para poder eliminarlo luego
    }

    // Crea el mensaje del bot y "escribe" el texto con animación
    function crearMensajeBotEscribiendo(texto, velocidadMs = 20) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      const img = document.createElement('img');
      img.src = BOT_AVATAR;
      img.alt = 'Chatbot';
      img.className = 'avatar bot-avatar';
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      const textEl = document.createElement('div');
      textEl.className = 'message-text';
      textEl.textContent = '';
      bubble.appendChild(textEl);
      messageDiv.appendChild(img);
      messageDiv.appendChild(bubble);
      chatBox.appendChild(messageDiv);

      const textoPlano = texto || '';
      let i = 0;
      const timer = setInterval(() => {
        textEl.textContent = textoPlano.slice(0, i++);
        scrollToBottom();
        if (i > textoPlano.length) {
          clearInterval(timer);
        }
      }, velocidadMs);
    }

    async function enviarMensaje() {
      const mensaje = userInput.value.trim();
      if (!mensaje) return;
      crearMensajeUsuario(mensaje);
      userInput.value = '';
      userInput.style.height = 'auto';
      const pensandoEl = mostrarPensando();
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: mensaje,
            session_id: sessionId
          })
        });
        const data = await response.json();
        // quitar el indicador de pensando
        if (pensandoEl && pensandoEl.parentNode) pensandoEl.parentNode.removeChild(pensandoEl);
        crearMensajeBotEscribiendo((data.respuesta || data.reply || 'Lo siento, no pude procesar tu solicitud.'));
      } catch (error) {
        if (pensandoEl && pensandoEl.parentNode) pensandoEl.parentNode.removeChild(pensandoEl);
        crearMensajeBot('⚠️ Error al conectar con el servidor. Intenta nuevamente.');
      }
      scrollToBottom();
    }

    sendBtn.addEventListener('click', enviarMensaje);
    userInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
      }
    });
    userInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Mensaje inicial al cargar
    window.addEventListener('load', function() {
      crearMensajeBotEscribiendo("👋 ¡Hola! Soy tu asesor tecnológico de Krear3D. ¿En qué puedo ayudarte hoy?", 15);
    });
  </script>
<?php get_footer(); ?>

Estilo uado  para el chatbot para el navbar:===============client.css========================

#asesorVirtualBtn {
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    border-radius: 2rem;
    background: linear-gradient(91deg, rgb(255, 155, 20), rgb(255, 98, 40), rgb(255, 155, 20));
    background-size: 200% 200%;
    white-space: nowrap;   
    vertical-align: middle; 
}

#asesorVirtualBtn span {
    display: inline;
}

#asesorVirtualBtn:hover {
    background-position: right center;
}

div usado para el chatbot==================header.php======================

<!-- NUEVO BOTÓN: ASISTENTE VIRTUAL -->
				<a id="asesorVirtualBtn" href="<?= home_url('/asistente-virtual/'); ?>">
					<span>Asistente IA</span>
				</a>
colocarlo dentro del div dw links