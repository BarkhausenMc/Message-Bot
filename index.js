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
  SectionBuilder,
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

const clanTraders = [
    {
        discordId: '1300411222126100542',
        mcName: 'PHOENIX318',
        mcUUID: '705069da-d48e-4576-9117-a4ca90810473',
        role: 'Trader Admin'
    },
    {
        discordId: '1301902544095674379',
        mcName: 'lf4kh2',
        mcUUID: '31795359-6952-4ec5-b7ce-e5362329e500',
        role: 'Moderator'
    },
    {
        discordId: '938086175250448465',
        mcName: 'Mattis039',
        mcUUID: '5b429070-3979-408d-a649-6a9b344af024',
        role: 'Moderator'
    },
    {
        discordId: '1398020676086140978',
        mcName: '.Sinnesrausch/C_ghg_C',
        mcUUID: 'da1f5ea9-c309-49a5-9e3f-d054e17f3a50',
        role: 'Trader'
    },
    {
        discordId: '1017849514515763210',
        mcName: 'sweati_',
        mcUUID: '0d483358-bbac-4cae-ae6e-97d01fcf5fd0',
        role: 'Trader'
    },
    {
        discordId: '1330545011917586452',
        mcName: 'j00nas0',
        mcUUID: 'fb90e8ab-9add-41d0-bcbd-7344bd6d057a',
        role: 'Trader'
    },
    {
        discordId: '380437818826031104',
        mcName: 'RedcookieYT',
        mcUUID: 'a6e5f2e7-e1e5-4284-a76e-391dfbf55753',
        role: 'Trader'
    },
    {
        discordId: '847100868616650762',
        mcName: 'Icbk',
        mcUUID: '9dc6d290-f942-448b-8e12-d92e0cb08228',
        role: 'Trader'
    },
    {
        discordId: '1072793446319915028',
        mcName: 'Qwizel',
        mcUUID: '2efabb07-913e-4df2-b10f-6d86d298aa31',
        role: 'Trader'
    },
];

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
                    'Wir freuen uns, unsere **Partnerschaft mit [HugoGuard](https://hugoguard.net/)** bekannt zu geben!\n\n' +
                    'Durch die Zusammenarbeit verbinden wir unseren Service mit der **API von HugoGuard**, um den Handel mit Spawnern **transparenter und sicherer** zu gestalten.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 📦 Spawner-Preise\n\n' +
                    'Wir übermitteln unsere **aktuellen Spawner-Preise** über die **HugoGuard-API**. Dadurch werden wir auf der [**Spawner-Handelsseite**](https://hugoguard.net/handel/spawners) als **Großhändler** angezeigt und unsere Preise können dort eingesehen werden.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🛡️ Scam-Prüfung\n\n' +
                    'Zusätzlich nutzen wir die **API von HugoGuard**, um **Scammer zu überprüfen**. Damit möchten wir das Handelsumfeld sicherer machen und unseren Nutzern **mehr Sicherheit beim Handeln** bieten.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🌐 Gemeinsam für sicheren Handel\n\n' +
                    'Die Partnerschaft ermöglicht es uns, unsere Angebote **besser sichtbar** zu machen und gleichzeitig auf **mehr Sicherheit und Transparenz** beim Spawner-Handel zu setzen.\n\n' +
                    '🙏 Vielen Dank an **HugoGuard** für die Zusammenarbeit!'
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (
        interaction.commandName !== 'trader-list' ||
        !interaction.inGuild() ||
        !interaction.member.roles.cache.has(admin)
    ) return;

    try {
        const Container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '# 🪪 Interne Trader-Übersicht\n\n' +
                    'Hier findest du eine Übersicht unserer **Trader**\nfür den Spawner-Handel des **TRADE** Clan.\n' +
                    'Die Liste dient der **internen Verwaltung und Zuordnung**\nunserer Trader anhand ihrer Discord- und Minecraft-Namen.'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            );

        for (const trader of clanTraders) {
            let member;

            try {
                member = await interaction.guild.members.fetch(
                    trader.discordId
                );
            } catch {
                console.warn(
                    `Trader ${trader.mcName} konnte nicht gefunden werden.`
                );
                continue;
            }

            Container.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `## ${trader.mcName}\n\n` +
                            `💬 **Discord:** ${member.displayName}\n` +
                            `🎮 **Minecraft:** ${trader.mcName} \n` +
                            `🎭 **Rolle:** ${trader.role}`
                        )
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(
                                `https://mc-heads.net/avatar/${trader.mcUUID}/100.png`
                            )
                            .setDescription(
                                `Minecraft-Kopf von ${trader.mcName}`
                            )
                        )
            );

            Container.addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            );
        }

        await interaction.channel.send({
            components: [Container],
            flags: MessageFlags.IsComponentsV2
        });

    } catch (error) {
        console.error('Fehler beim Senden der Trader-Liste:', error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Die Trader-Liste konnte nicht gesendet werden.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);