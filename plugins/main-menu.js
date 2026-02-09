import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn }) => {
  try {
    const userId = m.sender
    const user = global.db.data.users[userId] || {}
    const mode = global.opts.self ? 'Privado' : 'Público'
    const totalCommands = Object.keys(global.plugins).length
    const totalreg = Object.keys(global.db.data.users).length
    const uptime = clockString(process.uptime() * 1000)

            let menuText = `
╭════〔 🌺 GABRIEL  - UX 🌺 〕════╮
> │ 🧃 Usuario: @${userId.split('@')[0]}
> │ ⚡ Tipo: ${(conn.user.jid === global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
> │ 🌐 Modo actual: ${mode}
> │ 👥 Usuarios registrados:* ${totalreg}
> │ ⏱️ Tiempo activo: ${uptime}
> │ 💾 Comandos: ${totalCommands}
> | 🥷 descargas web: ${global.web}
> ╰════════════════════════════╯
🎮 *📋 COMANDOS DISPONIBLES 📋* ⚡
${readMore}`

    const imageBuffer = await (await fetch('https://files.catbox.moe/kdob25.jpg')).buffer()

    const media = await prepareWAMessageMedia(
      { image: imageBuffer },
      { upload: conn.waUploadToServer }
    )

    const msg = generateWAMessageFromContent(m.chat, {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        header: proto.Message.InteractiveMessage.Header.create({
          ...media,
          hasMediaAttachment: true
        }),
        body: proto.Message.InteractiveMessage.Body.create({
          text: menuText
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: 'GABRIEL-UX BOT'
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '👑 OWNER',
                id: '.owner'
              })
            },
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '🤖 SERBOT',
                id: '.code'
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '📸 INSTAGRAM',
                url: 'https://www.instagram.com/gabri_itss?igsh=MTEwNGI0YjNqamV3dA=='
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '🎵 TIKTOK',
                url: 'https://www.tiktok.com/@gab_zz32?_r=1&_t=ZS-93lYIcGGeDE'
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '🌐 WEB',
                url: 'https://gabriel-downloader.vercel.app/'
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '✐ CANAL OFICIAL',
                url: 'https://whatsapp.com/channel/0029VbCJFHmFy72CvfvzSR0Q'
              })
            }
          ]
        })
      })
    }, { userJid: m.chat })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Error al mostrar el menú', m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}