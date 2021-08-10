const { ArgumentType } = require("gcommands");

module.exports = {
    name: "command",
    description: "c",
    userRequiredPermissions: "MANAGE_GUILD",
    guildOnly: "747526604116459691",
    category: "category3",
    args: [
        {
            name: "enable",
            type: ArgumentType.SUB_COMMAND,
            description: "enable cmd",
            options: [
                {
                    name: "command",
                    type: ArgumentType.STRING,
                    description: "cmd name",
                    required: true
                }
            ]
        },
        {
            name: "disable",
            type: ArgumentType.SUB_COMMAND,
            description: "disable cmd",
            options: [
                {
                    name: "command",
                    type: ArgumentType.STRING,
                    description: "cmd name",
                    required: true
                }
            ]
        },
    ],
    run: async({client, respond, guild, edit}, args) => {
        let command = client.gcommands.get(args[1])
        if(!command) return respond(`Cmd doesn't exist. 👀`)
        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}

        if(args[0] == "disable") {
            if(!guildInfo.disabledCommands) guildInfo.disabledCommands = [];

            if(!guildInfo.disabledCommands.some(cmd => cmd.name == command.name)) guildInfo.disabledCommands.push(command)
            else return respond({content:`Cmd is already disabled. 👻`,ephemeral: true})

            client.database.set(`guild_${guild.id}`, guildInfo)
        }

        if(args[0] == "enable") {
            if(!guildInfo.disabledCommands) guildInfo.disabledCommands = [];

            if(!guildInfo.disabledCommands.some(cmd => cmd.name == command.name)) return respond({content:`Cmd is not disabled. 👻`,ephemeral: true})
            else {
                guildInfo.disabledCommands = guildInfo.disabledCommands.filter(cmd => cmd.name != command.name)
            }

            client.database.set(`guild_${guild.id}`, guildInfo)
        }

        guild.disabledCommands = guildInfo.disabledCommands;
        respond("Success!")
    }
}