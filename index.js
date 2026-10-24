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
    {
        discordId: '841575440631988244',
        mcName: 'Mondstiefel',
        mcUUID: 'f963a281-6646-46c0-9616-864af4bf808f',
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
        const traders = [];

        // Alle vorhandenen Discord-Mitglieder abrufen
        for (const trader of clanTraders) {
            try {
                const member = await interaction.guild.members.fetch(
                    trader.discordId
                );

                traders.push({
                    ...trader,
                    displayName: member.displayName
                });
            } catch {
                console.warn(
                    `Trader ${trader.mcName} konnte nicht gefunden werden.`
                );
            }
        }

        // Maximal 5 Trader pro Nachricht
        const tradersPerMessage = 5;

        for (
            let i = 0;
            i < traders.length;
            i += tradersPerMessage
        ) {
            const currentTraders = traders.slice(
                i,
                i + tradersPerMessage
            );

            const container = new ContainerBuilder();

            // Header nur in der ersten Nachricht
            if (i === 0) {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            '# 🪪 Interne Trader-Übersicht\n\n' +
                            'Hier findest du eine Übersicht unserer **Trader** ' +
                            'für den Spawner-Handel des **TRADE** Clan.\n\n' +
                            'Die Liste dient der **internen Verwaltung und Zuordnung** ' +
                            'unserer Trader anhand ihrer Discord- und Minecraft-Namen.'
                        )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setDivider(true)
                            .setSpacing(1)
                    );
            }

            for (const trader of currentTraders) {
                container.addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                `## ${trader.mcName}\n\n` +
                                `💬 **Discord:** ${trader.displayName}\n` +
                                `🎮 **Minecraft:** ${trader.mcName}\n` +
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

                container.addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(1)
                );
            }

            await interaction.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });
        }

    } catch (error) {
        console.error(
            'Fehler beim Senden der Trader-Liste:',
            error
        );

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Die Trader-Liste konnte nicht gesendet werden.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (
        interaction.commandName === 'trading-rules' &&
        interaction.inGuild() &&
        interaction.member.roles.cache.has(admin)
    ) {
        const tradingRulesContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '# 📜 Spawner Trading – Trader-Regeln\n' +
                    'Bitte haltet euch an die folgenden Regeln, damit alle Trades fair und sicher ablaufen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🚫 1. Kein Scamming\n' +
                    'Betrüge keine anderen Spieler. Jeder Trade muss ehrlich und fair ablaufen. Scamming wird nicht toleriert und hart bestraft.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🤝 2. Niemals First geben\n' +
                    'Gib niemals zuerst deine Spawner oder dein Geld heraus, bevor du die vereinbarte Gegenleistung erhalten hast. Nutze bei Bedarf einen vertrauenswürdigen Middleman.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 💬 3. Absprachen einhalten\n' +
                    'Halte dich an vereinbarte Preise, Mengen und Bedingungen. Änderungen sind nur erlaubt, wenn beide zustimmen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## ⚖️ 4. Ehrlich handeln\n' +
                    'Täusche niemanden über den Wert, die Anzahl oder die Eigenschaften deiner Spawner. Absichtliche Falschinformationen sind verboten.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🚫 5. Keine Fake-Angebote\n' +
                    'Biete keine Spawner, die du nicht besitzt oder gar nicht verkaufen möchtest/kannst. Halte deine Angebote realistisch und ehrlich.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🔒 6. Keine vereinbarten Trades abbrechen\n' +
                    'Wenn beide Seiten einem Trade zugestimmt haben, muss die Vereinbarung eingehalten werden. Ausnahmen sind nur mit Zustimmung beider Seiten möglich.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 📸 7. Beweise sichern\n' +
                    'Macht bei größeren Trades Screenshots oder Videos. Diese können bei Problemen als Beweis dienen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🤬 8. Respektvoll bleiben\n' +
                    'Beleidigungen, Drohungen, Provokationen und unnötige Streitigkeiten haben im Trading nichts zu suchen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 🛡️ 9. Eigenverantwortung\n' +
                    'Prüfe vor jedem Trade deinen Handelspartner, die vereinbarte Menge und die Gegenleistung. Handle vorsichtig und lass dich nicht unter Druck setzen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## 📩 10. Probleme melden\n' +
                    'Bei Scamming oder anderen Regelverstößen wende dich mit Beweisen an das zuständige Team. Versuche nicht, den Streit selbst eskalieren zu lassen.\n'
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(1)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    '## ⚠️ Konsequenzen\n' +
                    'Wer gegen diese Regeln verstößt, muss mit Konsequenzen bis hin zum Ausschluss vom Spawner Trading rechnen.\n\n' +
                    '**✅ Mit der Teilnahme am Spawner Trading akzeptierst du diese Regeln.**\n' +
                    '🤝 Handle fair, bleib ehrlich und schütze deine Items!'
                )
            );

        await interaction.channel.send({
            components: [tradingRulesContainer],
            flags: MessageFlags.IsComponentsV2
        });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);