require('dotenv').config();
const { Client, IntentsBitField, channelMention, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on("ready", (c) => {
    const commands = new SlashCommandBuilder()
    .setName("color")
    .setDescription("Change the color of your username!")
    .addRoleOption(option => option.setName("color").setDescription("Please choose the role in which the color you want.").setRequired(true));

    client.application.commands.create(commands);

    console.log("Bot Online!");
});

client.on('interactionCreate', (i) => {

    if (!i.isChatInputCommand()) return;

    if (i.channelId === process.env['CHANNEL_ID']) {
        if (i.commandName === "color") {
            const { options, member } = i;
            const color = options.getRole("color");
            const colors = ["cyan", "teal", "cerulean", "aegean", "mint", "castleton", "deep lilac", "eminence", "barbie", "rouge", "gold", "goldenrod", "orange", "ochre", "rose", "garnet", "lava", "rhino", "steel", "anchor"];

            if (colors.includes(color.name)) {
                colors.forEach( (c) => {
                    if (member.roles.cache.some(role => role.name === c)) {
                        const role = i.guild.roles.cache.find(r => r.name === c);

                        member.roles.remove(role.id).catch(err => {
                            console.error(err);
                            return;
                        });
                    }
                })

                member.roles.add(color).catch(err => {
                    console.error(err);
                    return;
                });

                i.reply("Color changed successfully!")
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor(getRandomColor())
                    .setTitle('Error 406')
                    .setAuthor({ name: 'Asphinx'})
                    .setDescription('Error 406: 406 Not Acceptable')
                    .addFields(
                        { name: 'Please choose one of these colors!', value:
                            "<@&1242572375279800340>\n\n<@&1242572482884665427>\n\n<@&1242572625826545756>\n\n<@&1242572671280222248>\n\n<@&1242573397838528634>\n\n<@&1242573738528997386>\n\n<@&1242573929248329758>\n\n<@&1242574255812771942>\n\n<@&1242574450420092950>\n\n<@&1242574619320385536>\n\n<@&1242574752816828516>\n\n<@&1242574793920741526>\n\n<@&1242574917619421284>\n\n<@&1242575018039316592>\n\n<@&1242575193730322472>\n\n<@&1242575270016188547>\n\n<@&1242575344863678585>\n\n<@&1242575539345166457>\n\n<@&1242575577349886024>\n\n<@&1242575608874143945>\n\n"
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Use `?help` for help'});

                i.reply({ embeds: [errorEmbed] })
            }
        }
    } else {
        i.reply("Command declined! \n Please send commands in " + channelMention(process.env['CHANNEL_ID']) + "!")
    }
})

client.on("messageCreate", (msg) => {
    if (msg.content === "?help") {
        if (msg.channelId === process.env['CHANNEL_ID'] && !msg.author.bot) {
            msg.reply("Do you want to change colors? Use `/color` and fill the command!" )
        } else {
            msg.reply("Command declined! \n Please send commands in " + channelMention(process.env['CHANNEL_ID']) + "!")
        }
    }
})

client.login(process.env['TOKEN'])


// Functions

function getRandomColor() {
    // Generate a random number between 0 and 255 for each color component
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
  
    // Convert the RGB values to a hexadecimal string
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  
    return hex;
}