require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
  ThumbnailBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle,
  TextDisplayComponent,
  Sweepers
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});;

const timestamp = new Date().toLocaleString('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

const admin = process.env.TRADER_ADMIN_ROLE_ID;
const trader = process.env.TRADER_ADMIN_ROLE_ID;

client.on('interactionCreate', async (interaction) =>{
    if (!interaction.isChatInputCommand()) return;

    if (
        interaction.member.roles.has(admin) &&
        interaction.commandName === 'rules'
    ) {
        const rulesContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '# 📜 REGELWERK 📜\n\n' +
                    'Bitte halte dich an die folgenden Regeln, damit ein respektvolles Miteinander gewährleistet ist.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 📌 Allgemeine Regeln\n\n' +
                    '1. Respektiere alle User auf dem Server.\n' +
                    '2. Vermeide Spam / Nachrichten wiederholt zu senden.\n' +
                    '3. NSFW / nicht jugendfreier Content ist auf jegliche Art und Weise unerwünscht.\n' +
                    '4. Werbung für andere Discordserver oder Social Media Plattformen ist verboten.\n' +
                    '5. Das Imitieren von Persönlichkeiten ist nicht erlaubt.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🚫 Politische und extremistische Symbolik\n\n' +
                    'Politische oder extremistische Symbolik ist in jeglicher Hinsicht verboten.\n\n' +
                    'Ausnahme: Server-Tags. Wenn diese jedoch zu extrem sind, wie zum Beispiel „Dritter Weg“ oder Ähnliches, werden sie gebannt.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 📖 Weitere Bestimmungen\n\n' +
                    'Außerdem gelten die allgemeinen [Discord Terms of Service](https://discord.com/terms) und die [Discord Community Guidelines](https://discord.com/guidelines).\n\n' +
                    '⚠️ **Unwissenheit schützt nicht vor Strafe.**'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '*Anpassung und Ergänzung durch das yayk Discord Team, 2026.*\n\n' +
                    `🕒 **Erstellt am:** ${timestamp}`
                )
            );

            await interaction.channel.send({
                components: [rulesContainer],
                flags: MessageFlags.IsComponentsV2
            });
    }
})