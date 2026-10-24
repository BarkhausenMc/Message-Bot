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

const admin = process.env.TRADER_ADMIN_ROLE_ID;
const trader = process.env.TRADER_ROLE_ID;

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

async function updateMemberCount(guild) {
  try {
    if (!guild) return;

    const channel = await guild.channels.fetch(
      process.env.MEMBER_COUNT_CHANNEL_ID
    );

    if (!channel) return;

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (!isVoice) return;

    const name = `👥・Members: ${guild.memberCount}`;

    if (channel.name !== name) {
      await channel.setName(name);
    }

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();

  if (guild) {
    await updateMemberCount(guild);
  }

  setInterval(() => {
    if (guild) {
      updateMemberCount(guild);
    }
  }, 60000);
});

client.on('guildMemberAdd', async (member) => {

  try {
    await member.roles.add(process.env.MEMBER_ROLE_ID);
  } catch (error) {
    console.error('Fehler beim Vergeben der Rolle:', error);
  }

  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});

client.on('guildMemberRemove', async (member) => {
  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});

client.on('interactionCreate', async (interaction) =>{
    if (!interaction.isChatInputCommand()) return;

    if (
        interaction.commandName === 'rules' &&
        interaction.inGuild() &&
        interaction.member.roles.cache.has(admin)
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
                    `🕒 **Zu letzt Aktualisiert am:** ${timestamp}`
                )
            );

            await interaction.channel.send({
                components: [rulesContainer],
                flags: MessageFlags.IsComponentsV2
            });
    }
});

client.on('interactionCreate', async (interaction) =>{
    if (!interaction.isChatInputCommand()) return;

    if (
        interaction.commandName === 'partner-hugoguard' &&
        interaction.inGuild() &&
        interaction.member.roles.cache.has(admin)
    ) {
        const partnerHugoGuardContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '# 🤝 Partner: HugoGuard\n\n' +
                    'Wir freuen uns, unsere Partnerschaft mit [HugoGuard](https://hugoguard.net/) bekannt zu geben!\n\n' +
                    'Durch die Zusammenarbeit verbinden wir unseren Service mit der API von HugoGuard, um den Handel mit Spawnern transparenter und sicherer zu gestalten.\n\n' +
                    '## 📦 Spawner-Preise\n\n' +
                    'Wir übermitteln unsere aktuellen Spawner-Preise über die HugoGuard-API. Dadurch werden wir auf der [Spawner-Handelsseite](https://hugoguard.net/handel/spawners) als Großhändler angezeigt und unsere Preise können dort eingesehen werden.\n\n' +
                    '## 🛡️ Scam-Prüfung\n\n' +
                    'Zusätzlich nutzen wir die API von HugoGuard, um Scammer zu überprüfen. Damit möchten wir das Handelsumfeld sicherer machen und unseren Nutzern mehr Sicherheit beim Handeln bieten.\n\n' +
                    '## 🌐 Gemeinsam für sicheren Handel\n\n' +
                    'Die Partnerschaft ermöglicht es uns, unsere Angebote besser sichtbar zu machen und gleichzeitig auf mehr Sicherheit und Transparenz beim Spawner-Handel zu setzen.\n\n' +
                    'Vielen Dank an HugoGuard für die Zusammenarbeit!'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('HugoGuard besuchen')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://hugoguard.net/')
                        .setEmoji('🌐'),

                    new ButtonBuilder()
                        .setLabel('Spawner-Handel ansehen')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://hugoguard.net/handel/spawners')
                        .setEmoji('📦')
                )
            );
                    
            await interaction.channel.send({
                components: [partnerHugoGuardContainer],
                flags: MessageFlags.IsComponentsV2
            });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);