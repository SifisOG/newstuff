const Discord = require('discord.js');
const ketse = new Discord.Client({partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'],ws: {properties: {$browser: "Discord iOS"}} })
const db = require('quick.db')
const config = require('./config.json')
const Invites = new Discord.Collection();
const moment = require('moment');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' })
const disbut = require('discord-buttons')
const { MessageMenuOption, MessageMenu, MessageActionRow, MessageButton } = require('discord-buttons') 
disbut(ketse)
const djs = require('djs-fun-v12') 
let prefix = "!";
const ms = require('ms')
const axios = require('axios')
ketse.on("ready", () =>{
    console.log(ketse.user.username + "is online")
    setInterval(() => {
      ketse.guilds.cache.get(config['server id']).channels.cache.get(config.stats.members).setName(`Members: ${ketse.guilds.cache.get(config['server id']).memberCount}`)
      ketse.guilds.cache.get(config['server id']).channels.cache.get(config.stats.boost).setName(`Boosts: ${ketse.guilds.cache.get(config['server id']).premiumSubscriptionCount}`)
    }, 6 * 3600000);
    ///LIVE STATUS
    setInterval(async() => {

      const guild = ketse.guilds.cache.get(config['server id'])
     if (guild) {
       const channel = guild.channels.cache.get(config.livestatus.channel)
       if (channel) {
         const messages = await channel.messages.fetch();
         const firstMessage = messages.first(); 
 
 
 
         
           if (firstMessage) {
             try {
                 const serverIP = `${config.fivem.ip}:${config.fivem.port}`
                 const { data } = await axios.get(`http://${serverIP}/dynamic.json`);
                 const regex = /\[([0-9]+)\]/;
                 const queue = data.hostname.match(regex);
                 if (queue) {
                   return firstMessage.edit( new Discord.MessageEmbed()
                     .setColor("BLACK")
                     .setAuthor(guild.name, guild.iconURL({format: "gif"}))
                     .setDescription(`**Για να συνδεθείτε στον server μας πατήστε \`F8\` και γράψτε \`connect ${serverIP}\`**`)
                     .addFields(
                       {name: "**Server Status**", value: "<:ketse:"+ config.livestatus.online +">**Online**", inline:true},
                       {name: "**Players**", value: `**${data.clients}/${data.sv_maxclients}**`, inline: true},
                         {name: "**Queue**", value: `${queue[1]}`, inline: true}
                     )
                     .setFooter("Αναβαθμίστηκε στις " + moment(new Date()).format('h:mm:ss a') || "None")
                   );
                 } else {
                   return firstMessage.edit(new Discord.MessageEmbed()
                     .setColor("BLACK")
                     .setAuthor(guild.name, guild.iconURL({format: "gif"}))
                     .setDescription(`**Για να συνδεθείτε στον server μας πατήστε \`F8\` και γράψτε \`connect ${serverIP}\`**`)
                     .addFields(
                       {name: "**Server Status**", value: "<:ketse:"+ config.livestatus.online +">**Online**", inline:true},
                         {name: "**Players**", value: `**${data.clients}/${data.sv_maxclients}**`, inline: true},
                         {name: "**Queue**", value: `**0**`, inline: true}
                     )
                     .setFooter("Αναβαθμίστηκε στις " + moment(new Date()).format('h:mm A') || "None")
 
                   );
                 }
               }catch (e) {
                 console.log(e.message);
                 firstMessage.edit(new Discord.MessageEmbed()
                 .setColor("BLACK")
                 .setAuthor(guild.name, guild.iconURL({format: "gif"}))
                 
                 .addFields(
                   {name: "**Server Status**", value: "<:ketse:"+ config.livestatus.offline +">**Offline**", inline:true},
                     {name: "**Players**", value: `**0**`, inline: true},
                     {name: "**Queue**", value: `**0**`, inline: true}
                 )
                 .setFooter("Αναβαθμίστηκε στις " + moment(new Date()).format('h:mm A')) || "None");
               }
         } else{
           channel.send(new Discord.MessageEmbed()
           .setDescription("`ketse`") || "None").catch(e =>{
             console.log(e.message)
           })
         }  
 
       }
     } 
   }, 3000) 
ketse.api.applications(ketse.user.id).guilds(config['server id']).commands.post({
      data: {
          name: "developer",
          description: `Σας δείχνει ποιός έφτιαξε το bot του ${ketse.guilds.cache.get(config['server id']).name}`,
      }
});
ketse.ws.on('INTERACTION_CREATE', async interaction => {
      const command = interaction.data.name;
      const args = interaction.data.options;
  
      if(command == "developer") {
          const embed = new Discord.MessageEmbed()
              
          .setAuthor(`!Ketse`, ketse.users.cache.get("354953259557060621").displayAvatarURL(),`https://discord.com/users/354953259557060621`)

          ketse.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                  type: 4,
                  data: await createAPIMessage(interaction, embed), 
                  ephemeral: true
              }
          });
      }
});
})


ketse.on("message", async message =>{
    if(message.channel.type === "dm") return console.log(message.content + "\n" + message.author.username)
    if(!message.guild) return;
  if(message.channel.id === config.suggestion.channels['channel ena'] || message.channel.id === config.suggestion.channels['channel deytero']){
    message.react(config.suggestion.reacts['sin ena'])
    message.react(config.suggestion.reacts['plein ena'])
  }
  if(message.content.startsWith("ticket")){

      const embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
      .setColor('PINK')
      const Option1 = new MessageMenuOption()
      .setLabel("Support")
      .setDescription("Ζητήστε βοήθεια.")
      .setEmoji('📢')
      .setValue('support')
  
      const Option2 = new MessageMenuOption()
      .setLabel("Buy")
      .setDescription('Donate')
      .setEmoji('💸')
      .setValue('buy')
  
      const Option3 = new MessageMenuOption()
      .setLabel("Ban Appeal")
      .setDescription('Αίτημα για Ban Appeal')
      .setEmoji('🔞')
      .setValue('irewards')
  
      const Option4 = new MessageMenuOption()
      .setLabel("Partner")
      .setDescription('Αίτημα για partnership.')
      .setEmoji('🤝')
      .setValue('partner')
      
      const Option6 = new MessageMenuOption()
      .setLabel("Boost Rewards")
      .setDescription('Αίτημα για boost rewards.')
      .setEmoji('💷')
      .setValue('brewards')
  
      const Option7 = new MessageMenuOption()
      .setLabel("Other")
      .setDescription('Άλλο.')
      .setEmoji('❓')
      .setValue('other')
      
  
      const selection = new MessageMenu()
      .setID('Selection')
      .setMaxValues(1)
      .setMaxValues(1)
      .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
      .addOption(Option1)
      .addOption(Option2)
      .addOption(Option3)
      .addOption(Option4)
      .addOption(Option6)
      .addOption(Option7)
   message.channel.send(embed, selection)

}
  if(message.content.includes("discord.gg") || message.content.includes("discord.com/invite") || message.content.includes("discord.io") || message.content.includes(".gg")|| message.content.includes(".io")){
    if(message.member.hasPermission("ADMINISTRATOR")) return;
    message.delete().catch(()=>{});
  }
  //reports
if(message.channel.id === config.reports.staff){
  if(message.author.bot) return;
  const staff = message.mentions.users.first()
  if(!staff) return message.delete().catch(()=>{});
  if(staff){
    message.delete().catch(()=>{});
    message.channel.send(`**Το staff report σου παραχωρήθηκε στους ανωτέρους <@!${message.author.id}>**`).then(e => e.delete({timeout: 10000}).catch(()=>{}))
      const embed = new Discord.MessageEmbed()
      .setDescription(message.content)
      .addFields(
        {name: "\u200B", value: "**Mention:** <@!" + message.author.id + ">\n**Κανάλι:** <#" + message.channel.id + ">"}
      )
      .setColor("RED")
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      ketse.channels.cache.get(config.reports['logs-staff']).send(embed)
  }
}
if(message.channel.id === config.reports.player){
  if(message.author.bot) return;
  const staff = message.mentions.users.first()
  if(!staff) return message.delete().catch(()=>{});
  if(staff){
    message.delete().catch(()=>{});
    message.channel.send(`**Το player report σου παραχωρήθηκε στους ανωτέρους <@!${message.author.id}>**`).then(e => e.delete({timeout: 10000}).catch(()=>{}))
      const embed = new Discord.MessageEmbed()
      .setDescription(message.content)
      .addFields(
        {name: "\u200B", value: "**Mention:** <@!" + message.author.id + ">\n**Κανάλι:** <#" + message.channel.id + ">"}
      )
      .setColor("RED")
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      ketse.channels.cache.get(config.reports['player logs']).send(embed)
  }
}
if(message.channel.id === config.reports['ban appeal']){
  if(message.author.bot) return;
    message.delete().catch(()=>{});
    message.channel.send(`**Το ban appeal σου παραχωρήθηκε στους ανωτέρους <@!${message.author.id}>**`).then(e => e.delete({timeout: 10000}).catch(()=>{}))
      const embed = new Discord.MessageEmbed()
      .setDescription(message.content)
      .addFields(
        {name: "\u200B", value: "**Mention:** <@!" + message.author.id + ">\n**Κανάλι:** <#" + message.channel.id + ">"}
      )
      .setColor("RED")
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      ketse.channels.cache.get(config.reports['ban appeal logs']).send(embed)
}
if(message.channel.id === config.reports.bug){
  if(message.author.bot) return;
    message.delete().catch(()=>{});
    message.channel.send(`**Το bug σου παραχωρήθηκε στους ανωτέρους <@!${message.author.id}>**`).then(e => e.delete({timeout: 10000}).catch(()=>{}))
      const embed = new Discord.MessageEmbed()
      .setDescription(message.content)
      .addFields(
        {name: "\u200B", value: "**Mention:** <@!" + message.author.id + ">\n**Κανάλι:** <#" + message.channel.id + ">"}
      )
      .setColor("RED")
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      ketse.channels.cache.get(config.reports['bug logs']).send(embed)
}
  if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();


    if (command === 'gamaw') {
        const embe = new Discord.MessageEmbed({
          "colour": ("BLACK"),
            "fields": [
                {
                    "name": message.guild.name + '\u200B',
                    "value": "\u200B\n**Για να δείξετε οτι είστε ενεργός τότε πατήστε στον πράσινο κύκλο\nΓια να δείξετε οτι είστε ανενεργός τότε πατήστε στον κόκκινο κύκλο\n\n> <:ketse:" + config.livestatus.online + "> Εντός υπηρεσίας\n\n> <:ketse:" + config.livestatus.offline + "> Εκτός υπηρεσιας**"
                }
            ]
        })

        const online = new disbut.MessageButton()
            .setEmoji(config.livestatus.online)
            .setStyle("green")
            .setID("online")
        const offline = new disbut.MessageButton()
            .setEmoji(config.livestatus.offline)
            .setStyle("red")
            .setID("offline")


        const buttons = new disbut.MessageActionRow()
            .addComponent(online)
            .addComponent(offline)

        message.channel.send({ embed: embe, component: buttons })


    }

if(command === 'activity'){
  if(!message.member.hasPermission("ADMINISTRATOR")) return;
  let arena = db.all().filter(data => data.ID.startsWith(`arena_${message.guild.id}`)).sort((a, b) => b.data - a.data)
            if(!arena) message.delete().catch(()=>{});;
            if(arena !== null){
             
                let content = "";
            
                for (let i = 0; i < arena.length; i++) {
                    let user = ketse.users.cache.get(arena[i].ID.split('_')[2])
                    let hours = Math.floor(arena[i].data / 3600000) % 24;
                    let minutes = Math.floor(arena[i].data / 60000) % 60;
                    let seconds = Math.floor(arena[i].data / 1000) % 60;   
                    if(hours) hours = `${hours}ω:`;
                    if(minutes) minutes = `${minutes}λ:`;
                    if(seconds) seconds = `${seconds}δ`;
                    if(!hours) hours = ``;
                    if(!minutes) minutes = ``;
                    if(!seconds) seconds = ``;
            
                    content += `**\`${i+1}\`. ${user} έχει \`${hours}${minutes}${seconds}\`**\n`
                }
            
        
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`**ACtivity Staff**`)
                    .setDescription(content)
                    
                    .setColor("#000000")
                
                    message.channel.send(embed)
            }


}
if(command === 'activity-reset'){
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
        let arena = db.all()
        .map(entry => entry.ID)
        .filter(id => id.startsWith(`arena_${message.guild.id}`))
        arena.forEach(db.delete)
}
if(command === 'leaderboard' || command === 'lb'){

  
  var data = db.get(`invites_${message.guild.id}`) || {};



const guilds = Object.keys(data).map(_data => {
  return {
      Id: _data,
      Value: (data[_data].total || 0)
  };
}).sort((x, y) => y.Value - x.Value);

const generateEmbed = start => {
  const current = guilds.slice(start, start + 10)

  const tes = start + 10
  const embed = new Discord.MessageEmbed()
    .setFooter(`${Math.floor(tes / 10)}/${Math.floor(guilds.length / 10)}`)
    .setColor("BLACK")
    .setAuthor(message.guild.name , message.guild.iconURL())
    db.set(`leaderboardtset_${message.guild.id}`, start)
    let content = "";

  current.forEach(g => {

    const i = db.add(`leaderboardtset_${message.guild.id}`, 1)
     content += `\`${i}.\` <@!${g.Id}> ${ketse.emojis.cache.get(config.emojis.right)} \`${g.Value}\`\n`
}
)
embed.setDescription(content)
  return embed
}

const author = message.author

message.channel.send(generateEmbed(0)).then(message => {
  if (guilds.length <= 10) return;
  message.react(config.emojis.right)
    
    const collector = message.createReactionCollector(
    (reaction, user) => [config.emojis.left, config.emojis.right].includes(reaction.emoji.id) && user.id === author.id,
    {time: 600000}
  )

 let currentIndex = db.get(`leaderboardtset_${message.guild.id}`)
  collector.on('collect', reaction => {
    message.reactions.removeAll().then(async () => {
      if(currentIndex < 10) return message.edit(generateEmbed(currentIndex));
      reaction.emoji.id === config.emojis.left ? currentIndex -= 10 : currentIndex += 10
      message.edit(generateEmbed(currentIndex - 10))
      if(currentIndex > 10) await message.react(config.emojis.left)
      db.set(`leaderboardtset_${message.guild.id}`, currentIndex - 10)
      if (currentIndex < guilds.length) message.react(config.emojis.right)
    })
  })
})


}
if(command === 'inv' || command === 'invites'){
  var victim = message.mentions.users.first() || ketse.users.cache.get(args[0]) || message.author;
  var data = db.get(`invites_${message.guild.id}.${victim.id}`) || { total: 0, fake: 0, inviter: null, regular: 0, leave: 0 };
  var embed = new Discord.MessageEmbed()
  .setAuthor(victim.tag, victim.displayAvatarURL(), "https://discord.com/users/"+ victim.id)
  .setDescription(`**Βρέθηκαν \`${(data.total || 0)}\` προσκλήσεις για τον <@!${victim.id}>**`)
  .setColor("BLACK");
  message.channel.send(embed);
}
if(command === 'staff'){
  if(message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.get(config['staff team role id'])){

  //👑Founders
  const members = message.guild.roles.cache.get(config.staff.owner).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff.owner).id + ">")
  const embed1 = new Discord.MessageEmbed()
  .setDescription(members)
  .setColor(message.guild.roles.cache.get(config.staff.owner).hexColor)
  
  //Owner
  const owner = message.guild.roles.cache.get(config.staff['co-owner']).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff['co-owner']).id + ">")
  const embed2 = new Discord.MessageEmbed()
  .setDescription(owner)
  .setColor(message.guild.roles.cache.get(config.staff['co-owner']).hexColor)

  //co owner
  

    //general manager
    const generalmanager = message.guild.roles.cache.get(config.staff['head admins']).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff['head admins']).id + ">")
    const embed4 = new Discord.MessageEmbed()
    .setDescription(generalmanager)
    .setColor(message.guild.roles.cache.get(config.staff['head admins']).hexColor)

 //server manager
    const server = message.guild.roles.cache.get(config.staff.admins).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff.admins).id + ">")
    const embed5 = new Discord.MessageEmbed()
    .setDescription(server)
    .setColor(message.guild.roles.cache.get(config.staff.admins).hexColor)

 //staff manager
 const staff = message.guild.roles.cache.get(config.staff.moderator).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff.moderator).id + ">")
 const embed6 = new Discord.MessageEmbed()
 .setDescription(staff)
 .setColor(message.guild.roles.cache.get(config.staff.moderator).hexColor)
  
 //head admin
 const headadmin = message.guild.roles.cache.get(config.staff.helper).members.map(e => "<@!" + e.user.id + "> <a:ketse:" + ketse.emojis.cache.get(config.emojis.right) + "> <@&" + message.guild.roles.cache.get(config.staff.helper).id + ">")
 const embed7 = new Discord.MessageEmbed()
 .setDescription(headadmin)
 .setColor(message.guild.roles.cache.get(config.staff.helper).hexColor)


 
 
message.channel.send(embed1).catch(()=>{})
message.channel.send(embed2).catch(()=>{})
message.channel.send(embed4).catch(()=>{})
message.channel.send(embed5).catch(()=>{})
message.channel.send(embed6).catch(()=>{})
message.channel.send(embed7).catch(()=>{})
  }

}
if(command === 'clear'){
  const number = args.join(" ")
  if(!number) return message.delete().catch(()=>{});
  if(number){
    message.channel.bulkDelete(number).catch(()=>{message.delete().catch(()=>{});});
  }
}
if(command === 'members'){
  const role = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(e => e.name === args.join(" "))
  if(!role) return message.delete().catch(()=>{});
  
  let i = 1
    if(message.guild.roles.cache.get(role.id).members.size < 10) return message.channel.send(new Discord.MessageEmbed()
    .setColor("BLACK")
    .setAuthor(message.guild.name , ketse.user.displayAvatarURL())
    .setDescription(message.guild.roles.cache.get(role.id).members.map(e => "`" + i++ + ".` <@!" + ketse.users.cache.get(e.user.id) + ">"
      ).join("\n ", )));

  var guilds = message.guild.roles.cache.get(role.id).members.array();


      const generateEmbed = start => {
        const current = guilds.slice(start, start + 10)
      
        const embed = new Discord.MessageEmbed()
          .setColor('BLACK')
          .setAuthor(message.guild.name , ketse.user.displayAvatarURL())
          db.set(`leaderboardtset_${message.guild.id}`, start)

          let content = "";

        current.forEach(g => {

          const i = db.add(`leaderboardtset_${message.guild.id}`, 1)
          const count = ketse.users.cache.get(g)
          content += `\`${i}.\` ${g} ${ketse.emojis.cache.get(config.emojis.right)} **${role}**\n`
      }
      )
      embed.setDescription(content)
        return embed
      }
      
      const author = message.author
      
      message.channel.send(generateEmbed(0)).then(message => {
        message.react(config.emojis.left)
        message.react(config.emojis.right)
          
          const collector = message.createReactionCollector(
          (reaction, user) => [config.emojis.left, config.emojis.right].includes(reaction.emoji.id) && user.id === author.id,
          {time: 60000}
        )
      
       let currentIndex = db.get(`leaderboardtset_${message.guild.id}`)
        collector.on('collect', reaction => {
          if (reaction.emoji.id === config.emojis.right) {
          reaction.users.remove(author);
          currentIndex += 10;
              if (currentIndex >= generateEmbed) {
                currentIndex -= 10;
                
              }
        db.set(`leaderboardtset_${message.guild.id}`, currentIndex)
        reaction.message.edit(generateEmbed(currentIndex - 10)).catch(()=>{});
            }
            if (reaction.emoji.id === config.emojis.left) {
          reaction.users.remove(author);
          currentIndex -= 10;
              if (currentIndex < 0) {
                currentIndex = db.set(`leaderboardtset_${message.guild.id}`, 0);
              }
        db.set(`leaderboardtset_${message.guild.id}`, currentIndex - 10)
              reaction.message.edit(generateEmbed(currentIndex)).catch(()=>{});
            }
        })
      })

}
if(command == 'say'){
  if(!message.member.hasPermission("ADMINISTRATOR")) return;
  const afsd = args.join(" ")
  if(!afsd) return;
  if(afsd){
    const embed = new Discord.MessageEmbed()
    .setDescription(afsd)
    .setColor("BLACK")
    message.channel.send(embed)
  }
}
if(command === 'apps'){
const embed1 = new Discord.MessageEmbed()
.setColor(message.guild.roles.cache.get(config.applications['staff id']).hexColor)
.setDescription('**[<@&' + config.applications['staff id'] +  '>](' + config.applications['staff app'] +  ')**')
const embed2 = new Discord.MessageEmbed()
.setColor(message.guild.roles.cache.get(config.applications['astynomia id']).hexColor)
.setDescription('**[<@&'+config.applications['astynomia id']+'>](' + config.applications['astynomia app'] + ')**')
const embed3 = new Discord.MessageEmbed()
.setColor(message.guild.roles.cache.get(config.applications['ekab id']).hexColor)
.setDescription('**[<@&'+config.applications['ekab id']+'>]('+config.applications['ekab app']+')**')

message.channel.send(embed1) 
message.channel.send(embed2)    
message.channel.send(embed3)   

}
if(command == 'lock'){
  if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args.join(" ")) || message.guild.channels.cache.find(e => e.name === args.join(" ")) || message.channel
  message.delete().catch(()=>{});

  if(channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === false) {
    const lockchannelError2 = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(ketse.user.username, ketse.user.displayAvatarURL(), `https://discord.com/users/${ketse.user.id}/`)
    .setDescription("**Το κανάλι έχει ήδη κλειδωθεί από την ομάδα διαχείρισης**")

    return message.channel.send(lockchannelError2)
}
channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: false })

    const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(ketse.user.username, ketse.user.displayAvatarURL(), `https://discord.com/users/${ketse.user.id}/`)
    .setDescription("**Το κανάλι κλειδώθηκε από την ομάδα διαχείρισης**")
    channel.send(embed)
}
if(command == 'unlock'){
  if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args.join(" ")) || message.guild.channels.cache.find(e => e.name === args.join(" ")) || message.channel
  message.delete().catch(()=>{});

  if(channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === true) {
    const lockchannelError2 = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(ketse.user.username, ketse.user.displayAvatarURL(), `https://discord.com/users/${ketse.user.id}/`)
    .setDescription("**Το κανάλι έχει ήδη ξεκλειδωθεί από την ομάδα διαχείρισης**")

    return message.channel.send(lockchannelError2)
}
channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: true })

    const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(ketse.user.username, ketse.user.displayAvatarURL(), `https://discord.com/users/${ketse.user.id}/`)
    .setDescription("**Το κανάλι ξεκλειδώθηκε από την ομάδα διαχείρισης**")
    channel.send(embed)
}
if(command === 'ban'){
      if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You do not have permissions to use this command!');

      if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I do not have permissions to execute this command!')

      const user = message.member

      let member = message.mentions.members.first()
      let reason = args[1]

      

      if (!member) {
          member = await message.guild.members.cache.get(args[0])
      }

      if (!member) {
          try {
              member = await ketse.users.fetch(args[0])
          } catch (e) {
              console.log('An error occured.')
              return message.channel.send(new Discord.MessageEmbed()
              .setDescription("Could not find that member!")
              .setColor("RED"))
          }
      }

      if (!args[1]) {
          reason = "No reason provided";
      } else if (args[1]) {
          reason = args.slice(1).join(" ");
      }

      if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

      const bannedEmbed = new Discord.MessageEmbed()
          .setTitle('Banned Member!')
          .setDescription(`${member} was successfully banned.`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName, message.author.displayAvatarURL({
              dynamic: true
          }))
          .setTimestamp()

      const dmEmbed = new Discord.MessageEmbed()
          .setTitle("Banned!")
          .setDescription(`You have been ban from **${message.guild}**!`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName, message.author.displayAvatarURL({
              dynamic: true
          }))
          .setTimestamp()

      try {
          await message.guild.members.ban(member.id, {
              reason: reason
          })

          message.channel.send(bannedEmbed)

          try {
              await member.send(dmEmbed).catch(()=>{})

              user.send('I have successfully send the reason to the user!')
          } catch (e) {
              user.send('I could not DM the user! Reason logged.')
              console.log('An error occured while sending the DM embed!' + e)
          }
      } catch (e) {
          message.channel.send('An error occured while executing the action!')
          console.log("An error occured while executing the ban command!" + e)
      }
}
if(command === 'kick'){
      
const member = message.mentions.members.first()
const reason = args.slice(1).join(" ")

if(!message.member.hasPermission('KICK_MEMBERS')) {
    const no = new Discord.MessageEmbed()
    .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL({ dynamic: true})}`)
    .setDescription(`You dont have any permissions to execute this command!`)
    .setColor("RED")
    message.channel.send(no)
} else {
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
            const no2 = new Discord.MessageEmbed()
            .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL({ dynamic: true})}`)
            .setDescription(`I dont have permissions to kick!`)
            .setColor("RED")
            message.channel.send(no2)
    } else {

    if(!member) {
        const members = new Discord.MessageEmbed()
        .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL({ dynamic: true})}`)
        .setDescription(`Please mention someone to kick!`)
        .setColor("RED")
        message.channel.send(members)
    } else {
        if(!reason) {
            const r = new Discord.MessageEmbed()
            .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL()}`)
            .setDescription(`Please specify a reason!`)
            .setColor("RED")
            message.channel.send(r)
        } else {
            if(member.kickable) {
                member.kick(reason)
                const done = new Discord.MessageEmbed()
                .setTitle('Success!')
                .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL({ dynamic: true})}`)
                .setDescription(`Kicked ${member} for ${reason}.`)
                .setFooter(`Requested by: ${message.author.username}`)
                .setColor("RED")
                message.channel.send(done)
            } else {
                const cant = new Discord.MessageEmbed()
                .setAuthor(`${ketse.user.username}`, `${ketse.user.displayAvatarURL()}`)
                .setDescription("This user is either a **Moderator**, **Administrator** or has **some** sort of role higher than mine!")
                .setColor("RED")
                message.channel.send(cant)
            }
        }
    }
}

}
}
if(command === 'roles'){
  const user = message.mentions.members.first() || message.member || message.guild.members.cache.find(u => u.id === args[0])
  if(!user) return message.channel.send(new Discord.MessageEmbed()
  .setDescription("Please give a valid user!")
  .setColor("RED"))
  
  const userRoles = user.roles.cache
  .filter((role) => role.id !== message.guild.id)
  .map((roles) => roles.toString())
  .join(", ")

  let embed = new Discord.MessageEmbed()
  .addField("Roles", userRoles)
  .setColor("RED")
  .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true}), 'https://discord.com/users/' + user.id)
  message.channel.send(embed)

  
}
if(command === 'userinfo'){


      let user;
  
      if (!args[0]) {
        user = message.member;
      } else {
  
  
        if (isNaN(args[0])) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(":x: Invalid ID of the user.")
        .setColor("RED"))
  
  
        user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(err => { return message.channel.send(new Discord.MessageEmbed()
          .setDescription(":x: Unable to find this person... sorry :(")
          .setColor("RED")) })
      }
  
      if (!user) {
        return message.channel.send(new Discord.MessageEmbed()
        .setDescription(":x: Unable to find this person!")
        .setColor("RED"))
      }
  
  
      //OPTIONS FOR STATUS
  
      let stat = {
        online: "https://emoji.gg/assets/emoji/9166_online.png",
        idle: "https://emoji.gg/assets/emoji/3929_idle.png",
        dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
        offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
      }
  
      //NOW BADGES
      let badges = await user.user.flags
      badges = await badges.toArray();
  
      let newbadges = [];
      badges.forEach(m => {
        newbadges.push(m.replace("_", " "))
      })
  
      let embed = new Discord.MessageEmbed()
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
  
      //ACTIVITY
      let array = []
      if (user.user.presence.activities.length) {
  
        let data = user.user.presence.activities;
  
        for (let i = 0; i < data.length; i++) {
          let name = data[i].name || "None"
          let xname = data[i].details || "None"
          let zname = data[i].state || "None"
          let type = data[i].type
  
          array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``)
  
          if (data[i].name === "Spotify") {
            embed.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace("spotify:", "")}`)
          }
  
          embed.setDescription(array.join("\n"))
  
        }
      }
  
        //EMBED COLOR BASED ON member
        embed.setColor(user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor)
  
        //OTHER STUFF 
        embed.setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
  
        if (user.nickname !== null) embed.addField("Nickname", user.nickname)
        embed.addField("Joined At", moment(user.user.joinedAt).format("LLLL"))
          .addField("Account Created At", moment(user.user.createdAt).format("LLLL"))
          .addField("Common Information", `ID: \`${user.user.id}\`\nDiscriminator: #${user.user.discriminator}\nBot: ${user.user.bot}\nDeleted User: ${user.deleted}`)
          .addField("Badges", newbadges.join(", ").toLowerCase() || "None")
          .setFooter(user.user.presence.status, stat[user.user.presence.status])
  
  
  
        return message.channel.send(embed).catch(err => {
          return message.channel.send(new Discord.MessageEmbed()
          .setDescription("Error : " + err)
          .setColor("RED"))
        })
  
}
if(command === 'emojis'){
      let Emojis = "";
      let EmojisAnimated = "";
      let EmojiCount = 0;
      let Animated = 0;
      let OverallEmojis = 0;
  
      function Emoji(id) {
        return ketse.emojis.cache.get(id).toString();
      }
      message.guild.emojis.cache.forEach((emoji) => {
        OverallEmojis++;
        if (emoji.animated) {
          Animated++;
          EmojisAnimated += Emoji(emoji.id);
        } else {
          EmojiCount++;
          Emojis += Emoji(emoji.id);
        }
      });
      let Embed = new Discord.MessageEmbed()
        .setTitle(`Emojis in ${message.guild.name} | Emojis [${OverallEmojis}] `)
        .setDescription(
          `**Animated [${Animated}]**:\n${EmojisAnimated}\n\n**Standard [${EmojiCount}]**:\n${Emojis}`
        )
        .setColor('RANDOM');
  
      if (Embed.length > 2000) {
        return message.channel.send(
          `I'm sorry but, my limit is 2000 characters only!`
        );
      } else {
        message.channel.send(Embed);
      }
}
if(command === 'serverinfo'){

  const verificationLevels = {
      NONE: 'None',
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: '(╯°□°）╯︵ ┻━┻',
      VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
  };
  const filterLevels = {
      DISABLED: 'Off',
      MEMBERS_WITHOUT_ROLES: 'No Role',
      ALL_MEMBERS: 'Everyone'
  };
  const regions = {
      brazil: 'Brazil',
      europe: 'Europe',
      hongkong: 'Hong Kong',
      india: 'India',
      japan: 'Japan',
      russia: 'Russia',
      singapore: 'Singapore',
      southafrica: 'South Africa',
      sydeny: 'Sydeny',
      'us-central': 'US Central',
      'us-east': 'US East',
      'us-west': 'US West',
      'us-south': 'US South'
  };
    message.delete()
  const guild = message;
  const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
  const members = message.guild.members.cache;
  const channels = message.guild.channels.cache;
  const emojis = message.guild.emojis.cache;

  const ServerInfoEmbed = new Discord.MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor('BLUE')
      .setDescription(`Shows the server info for \`${message.guild.name}\``)
      .addField('General Info', [
          `**ID:** ${message.guild.id}`,
          `**Name:** ${message.guild.name}`,
          `**Owner:** ${message.guild.owner} (${message.guild.owner.id})`,
          `\u200b`
      ])
      .addField('Boost Info', [
          `**Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
          `**Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
          `\u200b`
      ])
      .addField('Counters', [
          `**Role Count:** ${roles.length}`,
          `**Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
          `**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
          `**Bots:** ${members.filter(member => member.user.bot).size}`,
          `**Humans:** ${members.filter(member => !member.user.bot).size}`,
          `**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
          `**Emoji Count:** ${emojis.size}`,
          `**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
          `\u200b`
      ])
      .addField('Additional Info', [
          `**Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
          `**Verification Level:**  ${verificationLevels[message.guild.verificationLevel]}`,
          `**Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
          `**Region:** ${regions[message.guild.region]}`,
          `\u200b`
      ])
      .setTimestamp()
      .setFooter(`Requested By: ${message.author.username}`)
  
  message.channel.send(ServerInfoEmbed)
}
if(command === 'uptime'){
  let days = Math.floor(ketse.uptime / 86400000);
  let hours = Math.floor(ketse.uptime / 3600000) % 24;
  let minutes = Math.floor(ketse.uptime / 60000) % 60;
  let seconds = Math.floor(ketse.uptime / 1000) % 60;

  let uptimeE = new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription(`**Uptime: \`${days}μ:${hours}ω:${minutes}λ:${seconds}δ\`**`)
  .setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL())
  message.channel.send(uptimeE)
  return;
}
if(command === 'supports'){
    const supports = db.get(`numberreborn_${message.author.id}_${message.guild.id}`)
    if(supports == null){
      const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      .setDescription(`**Δεν βρέθηκε κανένα support για τον/ην <@!${message.author.id}>**`)
      .setColor("BLACK")
      message.channel.send(embed)
    }
    if(supports !== null){
      const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL(), `https://discord.com/users/${message.author.id}`)
      .setDescription(`**Βρέθηκε \`${supports}\` support για τον/ην <@!${message.author.id}>.**`)
      .setColor("BLACK")
      message.channel.send(embed)
  }
}
if(message.channel.id === config['games channel id']){
if(command === 'tri'){
    game.handleMessage(message);

}
if(command === 'rps'){
  djs.rps(message, {
    startMessage: "message when command is triggered",
         //defualt: Rock Paper Scissors! \nHit a button below for your choice.
    rockButtonColor: "red",
       //defualt: red
    paperButtonColor: "gray",
     //defualt: gray
    scissorsButtonColor: "green"
   //defualt: green
})
}
if(command === 'coinflip'){
  djs.coinflip(message, {
    startMessage: "Το κερμα θα πέσει... διάλεξε κορώνα ή γράμματα",// defualt: :coin: The coin is in the air... Choose heads or tails below.
    headsColor: "red", //defualt: red
    tailsColor: "blurple" //defualt: blurple

})
}
}
if(command === 'rr'){
  const embed = new Discord.MessageEmbed({
    "color": 11606821,
    "description": "**`" + message.guild.name + "` 05:00, 10:00, 15:00, 20:00, 00:00**"
  })

  message.channel.send(embed)
}
if(command === 'mute'){
if(!message.member.hasPermission('ADMINISTRATOR')) return message.react("❎").catch(()=>{});
  //!mute [@User] [Time] [Reason]

  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  let time = args[1]
  let reason = args.slice(2).join(' ')
  let date = new Date().toLocaleString()
  let muteRole = message.guild.roles.cache.get(config['mute role'])

  if (!member) return;

  if (!reason) reason = 'Unspecified'

  if (!time || isNaN(ms(time))) {
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('You have to specify the time (1s, 2h, 3d).')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  if (ms(time) > 1209600000) {
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('You cannot mute him for more than 14 days.')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  if (member === message.member) {
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('You cannot mute yourself.')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  if (member === message.guild.me) {
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('You cannot mute me.')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  if (member.roles.cache.has(muteRole)) {
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('That member is already muted.')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  try {
      member.roles.add(muteRole)
  } catch (err) {
      console.log(err)
      let embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('Please double check your arguments and the discord roles.')
      return message.channel.send(embed).then(msg => msg.delete({ timeout: 8000 }))
  }

  let embed1 = new Discord.MessageEmbed()
      .setAuthor(`Muted Member`, message.member.user.displayAvatarURL({ dynamic: true }))
      .setColor('GREEN')
      .addField(`**=> Member:**`, `${member.user.tag}`)
      .addField(`**=> Author:**`, `${message.author.tag}`)
      .addField(`**=> Reason:**`, `${reason}`)
      .addField(`**=> Time:**`, `${time}`)
      .addField(`**=> Date:**`, `${date}`)

  let embed2 = new Discord.MessageEmbed({
    "color": 11606821,
    "thumbnail": {
      "url": member.user.displayAvatarURL()
    },
    "description": "**<@" + member.user.id + "> muted.\n\nΑπό τον/ην: <@" + message.member.user.id + ">\nΛόγος: `" + reason + "`\nΔιάρκεια: `" + time + "`**"
  })

  const channel = message.guild.channels.cache.find(ch => ch.id === config.logs.mute)
  if (!channel) {
      return noChannel(message)
  } else {
      try {
          channel.send(embed2)
      } catch (err) {
          return errorRunningCommand(message)
      }
  }
  message.channel.send(embed2)
let fasdf = message.member.user

  timeout(time, member, muteRole, message, reason, fasdf)
}
})
ketse.on("inviteCreate", (invite) => {
  var gi = Invites.get(invite.guild.id) || new Discord.Collection();
  gi.set(invite.code, invite);
  Invites.set(invite.guild.id, gi);
});
ketse.on("inviteDelete", (invite) => {
  var gi = Invites.get(invite.guild.id) || new Discord.Collection();
  gi.delete(invite.code);
  Invites.set(invite.guild.id, gi);
});
ketse.on("guildCreate", (guild) => {
guild.fetchInvites().then(invites => {
  Invites.set(guild.id, invites);
}).catch(e => {})
});
ketse.on('guildMemberAdd', async (member, message) => {
  if(!member.guild.me.hasPermission("ADMINISTRATOR")) return;
  if(member.user.bot) return;
  member.roles.add(member.guild.roles.cache.get(config['civillian role']));


  ////ALTS ACCOUNTS
  if (Date.now() - member.user.createdAt < 1000*60*60*24*1) {
      // Log Channel
      let channel = ketse.channels.cache.get(config.logs.welcome);

      //Embed for log channel
      const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setAuthor('\u200b', ketse.user.displayAvatarURL())
          .setDescription(`⚠ **Πιθανός λογαριασμός Alt**
          Χρήστης: ${member.user}
          Δημιουργήθηκε: ${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()} @ **${moment(member.user.createdAt).format('hh:mm a')}**
          *Ελέγξτε για να δείτε αν μοιάζουν με λογαριασμό alt ενός πρόσφατου αποκλεισμένου μέλους (Θα μπορούσε να είναι μια εικόνα προφίλ, ένα όνομα κ.λπ.)*`)
          .setFooter(`Αναγνωριστικό χρήστη: ${member.id}`)
          .setTimestamp();
      
      // Sends embed & kick msg with reactions
      if(channel){
          channel.send(embed)
          msg = await channel.send('Would you like for me to kick them?')
          msg.react('👍').then(() => msg.react('👎'))

      // Checking for reactionss
          msg.awaitReactions((reaction, user) => (reaction.emoji.name == '👍' || reaction.emoji.name == '👎') && (user.id !== ketse.user.id) , { max: 1, time: 600000, errors: ['time'] })
              .then(collected => {
                  const reaction = collected.first();
                  if (reaction.emoji.name === '👍') {
                      member.kick()
                      return msg.edit('User has been kicked!')
                  } else if (reaction.emoji.name === '👎') {
                     return msg.edit('Fine! The user can stay!')
                  }
              })
              .catch(collected => {
                  channel.send('You had 10 minutes to kick this user! Now, you must kick them manually.')
              })
              .catch(error => {
                  console.log(error)
              });
      }

  }

  var fake = (Date.now() - member.createdAt) / (1000*60*60*24*1) <= 3 ? true : false;

 

  
      member.guild.fetchInvites().then(gInvites => {
        const gi = (Invites.get(member.guild.id) || new Discord.Collection()).clone()
    var invite = gInvites.find(_i => gi.has(_i.code) && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !gInvites.has(_i.code));
    Invites.set(member.guild.id, gInvites);


    if(!invite){
      const channel = member.guild.channels.cache.get(config.logs.welcome)
      if(channel){
          const embed = new Discord.MessageEmbed()
          .setAuthor( member.user.username, member.user.displayAvatarURL(), "https://discord.com/users/" + member.user.id)
          .setDescription(` \`\`\` Join \`\`\` \n**Register**: \`${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()}\`\n**Mention:** <@!${member.user.id}>\n**Από τον/ην:** `)
          .setColor("BLACK")
          channel.send(embed).catch(() => {
            message.channel.send(Discord.MessageEmbed()
            .setTitle("`" + member.guild.name + "`")
            .setDescription("**Δεν μπορώ να αναγνωρίσω πώς μπήκε ο " + member + "**")
            .setColor("BLACK")
            .setTimestamp()
            );
          });
          return;
      } 
      if(!channel) return;
    }
    if (invite.inviter) { 
        db.set(`invites_${member.guild.id}.${member.id}.inviter`, invite.inviter.id); 
        if(fake){
            total = db.add(`invites_${member.guild.id}.${invite.inviter.id}.total`, 1);
            _fake = db.add(`invites_${member.guild.id}.${invite.inviter.id}.fake`, 1);
        }
        else{
            total = db.add(`invites_${member.guild.id}.${invite.inviter.id}.total`, 1);
            regular = db.add(`invites_${member.guild.id}.${invite.inviter.id}.regular`, 1);
        }

                    const channel = member.guild.channels.cache.get(config.logs.welcome)
                    if(channel){
                      const embed = new Discord.MessageEmbed()
                      .setAuthor( member.user.username, member.user.displayAvatarURL(), "https://discord.com/users/" + member.user.id)
                      .setDescription(` \`\`\` Join \`\`\` \n**Register**: \`${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()}\`\n**Mention:** <@!${member.user.id}>\n**Από τον/ην:** <@!${invite.inviter.id}>`)
                      .setColor("BLACK")
                      channel.send(embed).catch(() => {
                        message.channel.send(Discord.MessageEmbed()
                        .setTitle("`" + member.guild.name + "`")
                        .setDescription("**Δεν μπορώ να αναγνωρίσω πώς μπήκε ο " + member + "**")
                        .setColor("BLACK")
                        .setTimestamp()
                        );
                      });   
                    }
    }
    else {

      const channel = member.guild.channels.cache.get(config.logs.welcome)
      if(channel){
          const embed = new Discord.MessageEmbed()
          .setAuthor( member.user.username, member.user.displayAvatarURL(), "https://discord.com/users/" + member.user.id)
          .setDescription(` \`\`\` Join \`\`\` \n**Register**: \`${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()}\`\n**Mention:** <@!${member.user.id}>\n**Από τον/ην:** <@!${invite.inviter.id}>`)
          .setColor("BLACK")
          channel.send(embed).catch(() => {
            message.channel.send(Discord.MessageEmbed()
            .setTitle("`" + member.guild.name + "`")
            .setDescription("**Δεν μπορώ να αναγνωρίσω πώς μπήκε ο " + member + "**")
            .setColor("BLACK")
            .setTimestamp()
            );
          });
      }

    }
    db.set(`invites_${member.guild.id}.${member.id}.isfake`, fake);

        } 

      )


})
ketse.on("guildMemberRemove", async(member) =>{
  if(!member.guild.me.hasPermission("ADMINISTRATOR")) return;



var total = 0,  regular = 0, fakecount = 0, data = db.get(`invites_${member.guild.id}.${member.id}`);
if(!data){
  const embed = new Discord.MessageEmbed()
  .setAuthor( member.user.username, member.user.displayAvatarURL(), "https://discord.com/users/" + member.user.id)
  .setDescription(` \`\`\` Leave \`\`\` \n**Register**: \`${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()}\`\n**Mention:** <@!${member.user.id}>\n**Join:** \`${moment(member.user.joinedAt).format("MMM Do YYYY").toLocaleString()}\``)
  .setColor("BLACK")
  ketse.channels.cache.get(config.logs.leave).send(embed);
    return;
}

if(data.isfake && data.inviter){
    fakecount = db.subtract(`invites_${member.guild.id}.${data.inviter}.fake`, 1);
    total = db.subtract(`invites_${member.guild.id}.${data.inviter}.total`, 1);
}
else if(data.inviter){
    regular = db.subtract(`invites_${member.guild.id}.${data.inviter}.regular`, 1);
    total = db.subtract(`invites_${member.guild.id}.${data.inviter}.total`, 1);
}
if(data.inviter) bonus = db.get(`invites_${member.guild.id}.${data.inviter}.bonus`) || 0;


db.add(`invites_${member.guild.id}.${data.inviter}.leave`, 1);


const channel = member.guild.channels.cache.get(config.logs.leave)
if(channel){
  const embed = new Discord.MessageEmbed()
  .setAuthor( member.user.username, member.user.displayAvatarURL(), "https://discord.com/users/" + member.user.id)
  .setDescription(` \`\`\` Leave \`\`\` \n**Register**: \`${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()}\`\n**Mention:** <@!${member.user.id}>\n**Join:** \`${moment(member.user.joinedAt).format("MMM Do YYYY").toLocaleString()}\``)
  .setColor("BLACK")
  channel.send(embed);
}
})
ketse.on('messageDelete', async message => {
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) return     ketse.channels.cache.get(config.logs.messages).send(new Discord.MessageEmbed({
    "author": {
      "name": message.author.tag,
      "url": "https://discord.com/users/" + message.author.id ,
      "icon_url": message.author.displayAvatarURL()
    },
    "color": 15483204,
    "description": "​\n" + message.content + "\n\n**Mention: <@" + message.author.id + ">\nΚανάλι: <#" + message.channel.id + ">**"
  }));

	const { executor, target } = deletionLog;
  try{
	if (target.id == message.author.id) {
    ketse.channels.cache.get(config.logs.messages).send(new Discord.MessageEmbed({
      "author": {
        "name": message.author.tag,
        "url": "https://discord.com/users/" + message.author.id,
        "icon_url": message.author.displayAvatarURL()
      },
      "color": 15483204,
      "description": "​\n" + message.content + "\n\n**Mention: <@" + message.author.id + ">\nΚανάλι: <#" + message.channel.id + ">**\n**Από τον/ην: <@" + executor.id + ">**"
    }))
	} else {
    ketse.channels.cache.get(config.logs.messages).send(new Discord.MessageEmbed({
      "author": {
        "name": message.author.tag,
        "url": "https://discord.com/users/" + message.author.id ,
        "icon_url": message.author.displayAvatarURL()
      },
      "color": 15483204,
      "description": "​\n" + message.content + "\n\n**Mention: <@" + message.author.id + ">\nΚανάλι: <#" + message.channel.id + ">**"
    }))
	}
}catch{
  
}
});
ketse.on('guildBanAdd', async (guild, user) => {
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});

  const banLog = fetchedLogs.entries.first();

	if (!banLog) return console.log(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

	const { executor, target, reason } = banLog;

if(!reason){
  if (target.id === user.id) {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} banned\n\nΑπό τον/ην: ${executor}\nΛόγος: **`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	} else {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} banned\n\nΑπό τον/ην: \nΛόγος: **`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	}
}
if(reason){
  if (target.id === user.id) {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} banned\n\nΑπό τον/ην: ${executor}\nΛόγος: ${reason}**`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	} else {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} banned\n\nΑπό τον/ην: \nΛόγος: ${reason}**`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	}
}

});
ketse.on("guildBanRemove", async (guild, user) => {
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_REMOVE',
	});

const banLog = await fetchedLogs.entries.first();

if(!banLog) return console.log(`${user.tag} was unbanned from ${guild.name} but no audit log could be found.`);

const { executor, target, reason } = banLog;

if(!reason){
  if (target.id === user.id) {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} unbanned\n\nΑπό τον/ην: ${executor}\nΛόγος: **`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	} else {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} unbanned\n\nΑπό τον/ην: \nΛόγος: **`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	}
}
if(reason){
  if (target.id === user.id) {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} unbanned\n\nΑπό τον/ην: ${executor}\nΛόγος: ${reason}**`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	} else {
    const embed = new Discord.MessageEmbed();
    embed.setDescription(`**${user} unbanned\n\nΑπό τον/ην: \nΛόγος: ${reason}**`)
    embed.setColor("#000000")
    embed.setThumbnail(user.displayAvatarURL())
    ketse.channels.cache.get(config.logs.bans).send(embed)
	}
}
});
ketse.on("roleCreate", async (role) => {
  const fetchedLogs = await role.guild.fetchAuditLogs({
		limit: 1,
		type: 'ROLE_CREATE',
	});

  const fasdfa = fetchedLogs.entries.first();
	let { executor, target, reason } = fasdfa;
  if(executor === null) executor = "\u200B";
  if(target === null) target = "\u200B";
  if(reason === null) reason = "\u200B";

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setAuthor(executor.username, executor.displayAvatarURL(), `https://discord.com/users/${executor.id}`)
      .setDescription("A new role was created!")
      .addFields(
        {name: "User", value: executor.username},
        {name: "Role Name", value: target.name},
        {name: "Role ID", value: target.id},
        {name: "reason", value: reason}
      )
      // .setFooter(`Role ID: ${id}`)
      .setTimestamp();

    ketse.channels.cache.get(config.logs.role).send(embed);
});
ketse.on("roleDelete", async (role) => {

  const fetchedLogs = await role.guild.fetchAuditLogs({
		limit: 1,
		type: 'ROLE_DELETE',
	});

  const fasdfa = await fetchedLogs.entries.first();
	let { executor, target, reason, a } = fasdfa;
  if(executor === null) executor = "\u200B";
  if(target === null || target === undefined) target = "\u200B";
  if(reason === null) reason = "\u200B";

    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor(executor.username, executor.displayAvatarURL(), `https://discord.com/users/${executor.id}`)
      .setDescription("A new role was Deleted!")
      .addFields(
        {name: "User", value: executor.username},
        {name: "Role Name", value: role.name},
        {name: "Role ID", value: role.id},
        {name: "reason", value: reason}
      )
      // .setFooter(`Role ID: ${id}`)
      .setTimestamp();

    ketse.channels.cache.get(config.logs.role).send(embed);

});
ketse.on('guildMemberUpdate', async (oldMember, newMember) => {
  // Role removed
  if (newMember.roles.cache.size > oldMember.roles.cache.size) {
      let entry = await oldMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE '}).then(audit => audit.entries.first());
      let logUser = entry.executor.id;
      let fad = oldMember.guild.members.cache.get(entry.executor.id) || newMember.guild.members.cache.get(entry.executor.id);


      const roleRemovedEmbed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL(), `https://discord.com/users/${oldMember.user.id}`)
      
          newMember.roles.cache.forEach(role => {
          if (!oldMember.roles.cache.has(role.id)) {
            roleRemovedEmbed.setDescription(`**Mention:** <@!${oldMember.user.id}>
            **Ρόλος:** ${role}
            **Από τον/ην:** <@!${logUser}>`)

          }
      });

      const discordlogs = newMember.guild.channels.cache.get(config.logs.role);
      discordlogs.send(roleRemovedEmbed)
    }
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE '}).then(audit => audit.entries.first());
      let logUser = entry.executor.id;
      let fad = oldMember.guild.members.cache.get(entry.executor.id) || newMember.guild.members.cache.get(entry.executor.id);


      const roleRemovedEmbed = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL(), `https://discord.com/users/${newMember.user.id}`)
      
      oldMember.roles.cache.forEach(role => {


          if (!newMember.roles.cache.has(role.id)) {

            roleRemovedEmbed.setDescription(`**Mention:** <@!${oldMember.user.id}>
            **Ρόλος:** ${role}
            **Από τον/ην:** <@!${logUser}>`)

          }
      });

      const discordlogs = oldMember.guild.channels.cache.get(config.logs.role);

      discordlogs.send(roleRemovedEmbed)  
  }
});
ketse.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.channelID;
  let oldUserChannel = oldMember.channelID;


try{
    if(newUserChannel){
    const voicelogs = newMember.guild.channels.cache.get(config.logs.voice)
    const voiceeee = new Discord.MessageEmbed({
      "author": {
        "name": newMember.member.user.tag,
        "url": "https://discord.com/users/" + newMember.member.user.id,
        "icon_url": newMember.member.user.displayAvatarURL()
      },
      "color": 4371328,
      "description": "**Κανάλι: <#" + newUserChannel + "> • " + newMember.channel.name + "\nMention: <@" + newMember.member.user.id + ">**"
    })
    voicelogs.send(voiceeee)
    }

    else{
      if(oldUserChannel){
        const voicelogs = oldMember.guild.channels.cache.get(config.logs.voice)
        const voiceeee = new Discord.MessageEmbed({
          "author": {
            "name": newMember.member.user.tag,
            "url": "https://discord.com/users/" + newMember.member.user.id,
            "icon_url": newMember.member.user.displayAvatarURL()
          },
          "color": 15681608,
          "description": "**Κανάλι: <#" + oldUserChannel + "> • `" + oldMember.channel.name + "`\nMention: <@" + oldMember.member.user.id + ">**"
        })
        voicelogs.send(voiceeee)
      }
  }
}catch{
  e => console.log(e.message)
}
})
ketse.on("messageUpdate", async (oldMessage, newMessage) => {
    try{
  if(newMessage.author.bot) return
  let channel = oldMessage.guild.channels.cache.get(config.logs.messages)
  const url = oldMessage.url
  const embed = new Discord.MessageEmbed()
  .setTitle(`Edited Message Logs`)
  .setColor('#993366')
  .setTimestamp()
  .setURL(url)
  .addField(`Παλιο μυνημα`, `*${oldMessage.content}*`, false)
  .addField(`Τελικο μυνημα`, `*${newMessage.content}*`, false)
  .addField(`Το μυνημα ειναι του`, `**<@${oldMessage.author.id}>**`, true)
  .addField(`Καναλι που ηταν το μυνημα`, `**<#${oldMessage.channel.id}>**`, true)
  channel.send(embed)
    }catch{
        
    }
})
var temporary = [];
ketse.on('voiceStateUpdate', (oldMember, newMember) => {
////Support
if(newMember.channel == config.autosystem.support) {
      db.add(`numberreborn_${newMember.member.user.id}_${newMember.guild.id}`, 1)
    
          newMember.guild.channels.create(`📞 Support`, {
              type: 'voice', parent: newMember.channel.parentID, permissionOverwrites: [
                {
                  id: config['staff team role id'],
                  allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
                },
                {
                  id: newMember.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL']
                }
              ]
          }).then(async channel => {
              temporary.push({ newID: channel.id, guild: channel.guild });
              await newMember.setChannel(channel.id).catch(()=>{});
              if(newMember.member.user){
                ketse.channels.cache.get(config.notifications.donate).send(new Discord.MessageEmbed({
                  "color": 11606821,
                  "description": "<@" + newMember.member.user.id + "> `📞 Support`"
                }))
              }
          });
}
////Donate
if(newMember.channel == config.autosystem.donate) {
  newMember.guild.channels.create(`💸Donate`, {
      type: 'voice', parent: newMember.channel.parentID, permissionOverwrites: [
        {
          id: config['donate team role id'],
          allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
        },
        {
          id: newMember.guild.roles.everyone,
          deny: ['VIEW_CHANNEL']
        }
      ]
  }).then(async channel => {
      temporary.push({ newID: channel.id, guild: channel.guild });
      await newMember.setChannel(channel.id).catch(()=>{});
      if(newMember.member.user){
        ketse.channels.cache.get(config.notifications.donate).send(new Discord.MessageEmbed({
          "color": 11606821,
          "description": "<@" + newMember.member.user.id + "> `💸 Donate`"
        }))
      }

  });
}
if(temporary.length > 0) for (let i = 0; i < temporary.length; i++) {
        let ch = ketse.channels.cache.get(temporary[i].newID);
        if (ch.members.size === 0) {
            ch.delete().catch(()=>{});
            return temporary.splice(i, 1);
        }
}
});
ketse.on('clickMenu', async (menu, message) => {

  if(menu.values[0] === 'support') {
        await menu.reply.defer()
        menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
          const embed = new Discord.MessageEmbed()
          .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
          .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
          .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
          .setColor('YELLOW')
          const Option1 = new MessageMenuOption()
          .setLabel("Support")
          .setDescription("Ζητήστε βοήθεια.")
          .setEmoji('📢')
          .setValue('support')
      
          const Option2 = new MessageMenuOption()
          .setLabel("Buy")
          .setDescription('Donate')
          .setEmoji('💸')
          .setValue('buy')
      
          const Option3 = new MessageMenuOption()
          .setLabel("Ban Appeal")
          .setDescription('Αίτημα για Ban Appeal')
          .setEmoji('🔞')
          .setValue('irewards')
      
          const Option4 = new MessageMenuOption()
          .setLabel("Partner")
          .setDescription('Αίτημα για partnership.')
          .setEmoji('🤝')
          .setValue('partner')
      
          
          const Option6 = new MessageMenuOption()
          .setLabel("Boost Rewards")
          .setDescription('Αίτημα για boost rewards.')
          .setEmoji('💷')
          .setValue('brewards')
      
          const Option7 = new MessageMenuOption()
          .setLabel("Other")
          .setDescription('Άλλο.')
          .setEmoji('❓')
          .setValue('other')
          
      
          const selection = new MessageMenu()
          .setID('Selection')
          .setMaxValues(1)
          .setMaxValues(1)
          .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
          .addOption(Option1)
          .addOption(Option2)
          .addOption(Option3)
          .addOption(Option4)
          .addOption(Option6)
          .addOption(Option7)
          
       msg.edit(embed, selection).then(() => {
         console.log('to ticket allaxe')
       })
        })
    
       
        const alreadyticket = new Discord.MessageEmbed()
        .setAuthor(menu.guild.name, menu.guild.iconURL({ dynamic: true }))
        .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
        .setColor('#000000')
    
        const ch = menu.message.guild.channels.cache.find(ch => ch.name === `📢ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
        if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
        .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`📢 Support\` ticket.**`)
        .setTimestamp()
        .setColor('#000000'))).catch(channel =>{
          console.log(channel.message)
        })
        
       
     
        const data = await db.get(`tickets_${menu.message.guild.id}`)
        if(data == null) await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: 1})
      const supportchannel = await   menu.guild.channels.create(`📢ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            
                type: "text", 
            parent: menu.message.channel.parentID,
                
                
                        permissionOverwrites: [
                           {
                             id: menu.guild.roles.everyone, 
                             deny: ['VIEW_CHANNEL'] 
                           },
                           {
                  id: menu.clicker.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
               },
               {
                 id: config['staff team role id'],
                 allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
               },
                           
                        ],
                      }) 
           
    
              const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
              if(logs){
                const embed = new Discord.MessageEmbed({
                  "author": {
                    "name": menu.clicker.user.tag,
                    "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                    "icon_url": menu.clicker.user.displayAvatarURL()
                  },
                  "color": 3775833,
                  "description": "**Κανάλι: [`" + supportchannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + supportchannel.id + ") • `" + supportchannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                })
                logs.send(embed)
              }
              await db.set(`${supportchannel.id}`, menu.clicker.user.id)
              await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
  
              const mhnyma = new Discord.MessageEmbed()
            
              .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
              .setColor('#000000')
              const close1 = new MessageButton()
                                        .setStyle("green")
                                        .setLabel('🔒')
                                        .setID("close")
                      const buttonarray = [close1]
                      supportchannel.send({ embed: mhnyma, buttons: buttonarray})
      
  }  
  if(menu.values[0] === 'buy') {
          await menu.reply.defer()
          menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
            
            const embed = new Discord.MessageEmbed()
            .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
          .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
            .setDescription(`**Ορίστε την επιλογή που παρουσιάζει το ticket σας**`)
            .setColor('#000000')
            const Option1 = new MessageMenuOption()
            .setLabel("Support")
            .setDescription("Ζητήστε βοήθεια.")
            .setEmoji('📢')
            .setValue('support')
        
            const Option2 = new MessageMenuOption()
            .setLabel("Buy")
            .setDescription('Donate')
            .setEmoji('💸')
            .setValue('buy')
        
            const Option3 = new MessageMenuOption()
            .setLabel("Ban Appeal")
            .setDescription('Αίτημα για Ban Appeal')
            .setEmoji('🔞')
            .setValue('irewards')
        
            const Option4 = new MessageMenuOption()
            .setLabel("Partner")
            .setDescription('Αίτημα για partnership.')
            .setEmoji('🤝')
            .setValue('partner')
            
            const Option6 = new MessageMenuOption()
            .setLabel("Boost Rewards")
            .setDescription('Αίτημα για boost rewards.')
            .setEmoji('💷')
            .setValue('brewards')
        
            const Option7 = new MessageMenuOption()
            .setLabel("Other")
            .setDescription('Άλλο.')
            .setEmoji('❓')
            .setValue('other')
            
        
            const selection = new MessageMenu()
            .setID('Selection')
            .setMaxValues(1)
            .setMaxValues(1)
            .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
            .addOption(Option1)
            .addOption(Option2)
            .addOption(Option3)
            .addOption(Option4)
            .addOption(Option6)
            .addOption(Option7)
          
         msg.edit(embed, selection).then(() => {
           console.log('to ticket allaxe')
         })
          })
      
         
          const alreadyticket = new Discord.MessageEmbed()
          .setAuthor(menu.guild.name, menu.guild.iconURL({ dynamic: true }))
          .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
          .setColor('#000000')
      
          const ch = menu.message.guild.channels.cache.find(ch => ch.name === `💸ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
          if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
          .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`💸 Buy\` ticket.**`)
          .setTimestamp()
          .setColor('#000000'))).catch(channel =>{
            console.log(channel.message)
          })
          
         
       
          const data = await db.get(`tickets_${menu.message.guild.id}`)
          if(data == null) await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: 1})
        const supportchannel = await   menu.guild.channels.create(`💸ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
          
            type: "text", 
            parent: menu.message.channel.parentID,
            
                permissionOverwrites: [
                   {
                   id: menu.guild.roles.everyone, 
                   deny: ['VIEW_CHANNEL'] 
                   },
                  {
                    id: menu.clicker.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                 {
                   id: config['donate team role id'],
                   allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                ],
                }) 
             
                const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
                if(logs){
                  const embed = new Discord.MessageEmbed({
                    "author": {
                      "name": menu.clicker.user.tag,
                      "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                      "icon_url": menu.clicker.user.displayAvatarURL()
                    },
                    "color": 3775833,
                    "description": "**Κανάλι: [`" + supportchannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + supportchannel.id + ") • `" + supportchannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                  })
                  logs.send(embed)
                }
                await db.set(`${supportchannel.id}`, menu.clicker.user.id)
                await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
  
                const mhnyma = new Discord.MessageEmbed()
               
                .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
                .setColor('#000000')
                const close1 = new MessageButton()
                        .setStyle("green")
                        .setLabel('🔒')
                        .setID("close")
                        const buttonarray = [close1]
                        supportchannel.send({ embed: mhnyma, buttons: buttonarray})
                     
        
  } 
  if(menu.values[0] === 'irewards') {
          await menu.reply.defer()
          menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
            const embed = new Discord.MessageEmbed()
            .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
            .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
        .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
        .setColor('#000000')
        const Option1 = new MessageMenuOption()
        .setLabel("Support")
        .setDescription("Ζητήστε βοήθεια.")
        .setEmoji('📢')
        .setValue('support')
    
        const Option2 = new MessageMenuOption()
        .setLabel("Buy")
        .setDescription('Donate')
        .setEmoji('💸')
        .setValue('buy')
    
        const Option3 = new MessageMenuOption()
        .setLabel("Ban Appeal")
        .setDescription('Αίτημα για Ban Appeal')
        .setEmoji('🔞')
        .setValue('irewards')
    
        const Option4 = new MessageMenuOption()
        .setLabel("Partner")
        .setDescription('Αίτημα για partnership.')
        .setEmoji('🤝')
        .setValue('partner')
    
        
        const Option6 = new MessageMenuOption()
        .setLabel("Boost Rewards")
        .setDescription('Αίτημα για boost rewards.')
        .setEmoji('💷')
        .setValue('brewards')
    
        const Option7 = new MessageMenuOption()
        .setLabel("Other")
        .setDescription('Άλλο.')
        .setEmoji('❓')
        .setValue('other')
        
    
        const selection = new MessageMenu()
        .setID('Selection')
        .setMaxValues(1)
        .setMaxValues(1)
        .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
        .addOption(Option1)
        .addOption(Option2)
        .addOption(Option3)
        .addOption(Option4)
        .addOption(Option6)
        .addOption(Option7)
         msg.edit(embed, selection).then(() => {
           console.log('to ticket allaxe')
         })
          })
          const alreadyticket = new Discord.MessageEmbed()
          .setAuthor(menu.guild.name, menu.guild.iconURL({ dynamic: true }))
          .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
          .setColor('#000000')
      
          const ch = menu.message.guild.channels.cache.find(ch => ch.name === `🔞ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
          if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
          .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`🔞 Ban Appeal\` ticket.**`)
          .setTimestamp()
          .setColor('#000000'))).catch(channel =>{
            console.log(channel.message)
          })
          const data = await db.get(`tickets_${menu.message.guild.id}`)
          if(data == null) await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: 1})
        const buychannel = await  menu.guild.channels.create(`🔞ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            
            type: "text", 
                        parent: menu.message.channel.parentID,
            
                permissionOverwrites: [
                   {
                   id: menu.guild.roles.everyone, 
                   deny: ['VIEW_CHANNEL'] 
                   },
                  {
                    id: menu.clicker.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                   
                ],
                }) 
                const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
                if(logs){
                  const embed = new Discord.MessageEmbed({
                    "author": {
                      "name": menu.clicker.user.tag,
                      "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                      "icon_url": menu.clicker.user.displayAvatarURL()
                    },
                    "color": 3775833,
                    "description": "**Κανάλι: [`" + buychannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + buychannel.id + ") • `" + buychannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                  })
                  logs.send(embed)
                }
                await db.set(`${buychannel.id}`, menu.clicker.user.id)
            await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
  
    
                const mhnyma = new Discord.MessageEmbed()
              
                .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
                .setColor('#000000')
                const close1 = new MessageButton()
                        .setStyle("green")
                        .setLabel('🔒')
                        .setID("close")
                        const buttonarray = [close1]
                        buychannel.send({ embed: mhnyma, buttons: buttonarray})
  } 
  if(menu.values[0] === 'partner') {
          await menu.reply.defer()
          menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
            const embed = new Discord.MessageEmbed()
            .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
          .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
            .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
            .setColor('#000000')
            const Option1 = new MessageMenuOption()
            .setLabel("Support")
            .setDescription("Ζητήστε βοήθεια.")
            .setEmoji('📢')
            .setValue('support')
        
            const Option2 = new MessageMenuOption()
            .setLabel("Buy")
            .setDescription('Donate')
            .setEmoji('💸')
            .setValue('buy')
        
            const Option3 = new MessageMenuOption()
            .setLabel("Ban Appeal")
            .setDescription('Αίτημα για Ban Appeal')
            .setEmoji('🔞')
            .setValue('irewards')
        
            const Option4 = new MessageMenuOption()
            .setLabel("Partner")
            .setDescription('Αίτημα για partnership.')
            .setEmoji('🤝')
            .setValue('partner')
        
            
            const Option6 = new MessageMenuOption()
            .setLabel("Boost Rewards")
            .setDescription('Αίτημα για boost rewards.')
            .setEmoji('💷')
            .setValue('brewards')
        
            const Option7 = new MessageMenuOption()
            .setLabel("Other")
            .setDescription('Άλλο.')
            .setEmoji('❓')
            .setValue('other')
            
        
            const selection = new MessageMenu()
            .setID('Selection')
            .setMaxValues(1)
            .setMaxValues(1)
            .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
            .addOption(Option1)
            .addOption(Option2)
            .addOption(Option3)
            .addOption(Option4)
            .addOption(Option6)
            .addOption(Option7)
         msg.edit(embed, selection).then(() => {
           console.log('to ticket allaxe')
         })
          })
          const alreadyticket = new Discord.MessageEmbed()
          .setAuthor(menu.guild.name, menu.guild.iconURL({ dynamic: true }))
          .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
          .setColor('#000000')
      
          const ch = menu.message.guild.channels.cache.find(ch => ch.name === `🤝ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
          if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
          .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`🤝 Partner\` ticket.**`)
          .setTimestamp()
          .setColor('#000000'))).catch(channel =>{
            console.log(channel.message)
          })
          const data = await db.get(`tickets_${menu.message.guild.id}`)

        const partnerchannel = await  menu.guild.channels.create(`🤝ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            
            type: "text", 
            
                    parent: menu.message.channel.parentID,    
                permissionOverwrites: [
                   {
                   id: menu.guild.roles.everyone, 
                   deny: ['VIEW_CHANNEL'] 
                   },
                 
                  {
                    id: menu.clicker.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                   
                ],
                }) 
                const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
                if(logs){
                  const embed = new Discord.MessageEmbed({
                    "author": {
                      "name": menu.clicker.user.tag,
                      "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                      "icon_url": menu.clicker.user.displayAvatarURL()
                    },
                    "color": 3775833,
                    "description": "**Κανάλι: [`" + partnerchannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + partnerchannel.id + ") • `" + partnerchannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                  })
                  logs.send(embed)
                }
                await db.set(`${partnerchannel.id}`, menu.clicker.user.id)
                await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
    
                const mhnyma = new Discord.MessageEmbed()
             
                .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
                .setColor('#000000')
                const close1 = new MessageButton()
                        .setStyle("green")
                        .setLabel('🔒')
                        .setID("close")
                        const buttonarray = [close1]
                        partnerchannel.send({ embed: mhnyma, buttons: buttonarray})
                        
  } 
  if(menu.values[0] === 'brewards') {
          await menu.reply.defer()
          menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
            const embed = new Discord.MessageEmbed()
            .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
            .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
            .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
            .setColor('#000000')
            const Option1 = new MessageMenuOption()
            .setLabel("Support")
            .setDescription("Ζητήστε βοήθεια.")
            .setEmoji('📢')
            .setValue('support')
        
            const Option2 = new MessageMenuOption()
            .setLabel("Buy")
            .setDescription('Donate')
            .setEmoji('💸')
            .setValue('buy')
        
            const Option3 = new MessageMenuOption()
            .setLabel("Ban Appeal")
            .setDescription('Αίτημα για Ban Appeal')
            .setEmoji('🔞')
            .setValue('irewards')
        
            const Option4 = new MessageMenuOption()
            .setLabel("Partner")
            .setDescription('Αίτημα για partnership.')
            .setEmoji('🤝')
            .setValue('partner')
            
            const Option6 = new MessageMenuOption()
            .setLabel("Boost Rewards")
            .setDescription('Αίτημα για boost rewards.')
            .setEmoji('💷')
            .setValue('brewards')
        
            const Option7 = new MessageMenuOption()
            .setLabel("Other")
            .setDescription('Άλλο.')
            .setEmoji('❓')
            .setValue('other')
            
        
            const selection = new MessageMenu()
            .setID('Selection')
            .setMaxValues(1)
            .setMaxValues(1)
            .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
            .addOption(Option1)
            .addOption(Option2)
            .addOption(Option3)
            .addOption(Option4)
            .addOption(Option6)
            .addOption(Option7)
         msg.edit(embed, selection).then(() => {
           console.log('to ticket allaxe')
         })
          })
          const alreadyticket = new Discord.MessageEmbed()
          .setAuthor(menu.clicker.user.username, menu.clicker.user.displayAvatarURL())
          .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
          .setColor('#000000')
      
          const ch = menu.message.guild.channels.cache.find(ch => ch.name === `💷ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
          if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
          .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`💷 Boost Rewards\` ticket.**`)
          .setTimestamp()
          .setColor('#000000'))).catch(channel =>{
            console.log(channel.message)
          })
          const data = await db.get(`tickets_${menu.message.guild.id}`)
          const partnerchannel = await  menu.guild.channels.create(`💷ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            
            type: "text", 
                   parent: menu.message.channel.parentID,     
            
                permissionOverwrites: [
                   {
                   id: menu.guild.roles.everyone, 
                   deny: ['VIEW_CHANNEL'] 
                   },
                  {
                    id: menu.clicker.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                   
                ],
                }) 
                const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
                if(logs){
                  const embed = new Discord.MessageEmbed({
                    "author": {
                      "name": menu.clicker.user.tag,
                      "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                      "icon_url": menu.clicker.user.displayAvatarURL()
                    },
                    "color": 3775833,
                    "description": "**Κανάλι: [`" + partnerchannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + partnerchannel.id + ") • `" + partnerchannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                  })
                  logs.send(embed)
                }
              await db.set(`${partnerchannel.id}`, menu.clicker.user.id)
              await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
    
                const mhnyma = new Discord.MessageEmbed()
               
                .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
                .setColor('#000000')
                const close1 = new MessageButton()
                        .setStyle("green")
                        .setLabel('🔒')
                        .setID("close")
                        const buttonarray = [close1]
                        partnerchannel.send({ embed: mhnyma, buttons: buttonarray})
  } 
  if(menu.values[0] === 'other') {
          await menu.reply.defer()
          menu.message.channel.messages.fetch(config.ticket['message id']).then(msg => {
            const embed = new Discord.MessageEmbed()
            .setAuthor(menu.message.guild.name, menu.message.guild.iconURL({ dynamic: true }))
            .setThumbnail(menu.message.guild.iconURL({ dynamic: true }))
            .setDescription('**Ορίστε την επιλογή που παρουσιάζει το ticket σας**')
            .setColor('#000000')
            const Option1 = new MessageMenuOption()
            .setLabel("Support")
            .setDescription("Ζητήστε βοήθεια.")
            .setEmoji('📢')
            .setValue('support')
        
            const Option2 = new MessageMenuOption()
            .setLabel("Buy")
            .setDescription('Donate')
            .setEmoji('💸')
            .setValue('buy')
        
            const Option3 = new MessageMenuOption()
            .setLabel("Ban Appeal")
            .setDescription('Αίτημα για Ban Appeal')
            .setEmoji('🔞')
            .setValue('irewards')
        
            const Option4 = new MessageMenuOption()
            .setLabel("Partner")
            .setDescription('Αίτημα για partnership.')
            .setEmoji('🤝')
            .setValue('partner')
            
            const Option6 = new MessageMenuOption()
            .setLabel("Boost Rewards")
            .setDescription('Αίτημα για boost rewards.')
            .setEmoji('💷')
            .setValue('brewards')
        
            const Option7 = new MessageMenuOption()
            .setLabel("Other")
            .setDescription('Άλλο.')
            .setEmoji('❓')
            .setValue('other')
            
        
            const selection = new MessageMenu()
            .setID('Selection')
            .setMaxValues(1)
            .setMaxValues(1)
            .setPlaceholder('Ορίστε την επιλογή που παρουσιάζει το ticket σας')
            .addOption(Option1)
            .addOption(Option2)
            .addOption(Option3)
            .addOption(Option4)
            .addOption(Option6)
            .addOption(Option7)
         msg.edit(embed, selection).then(() => {
           console.log('to ticket allaxe')
         })
          })
          const alreadyticket = new Discord.MessageEmbed()
          .setAuthor(menu.clicker.user.username, menu.clicker.user.displayAvatarURL())
          .setDescription('```Έχεις ήδη ένα ticket ανοιχτό περίμενε μέχρι να σε εξυπηρετήσουν!```')
          .setColor('#000000')
      
          const ch = menu.message.guild.channels.cache.find(ch => ch.name === `❓ticket-${menu.clicker.user.username.toLowerCase().replace(/ +/g,'-').replace(/!/g, '')}`)
          if(ch) return menu.clicker.user.send(alreadyticket).then(menu.message.guild.channels.cache.find(ch => ch.id === config.ticket.logs).send(new Discord.MessageEmbed()
          .setDescription(`**Ο <@${menu.clicker.user.id}> προσπάθησε να ανοίξει ένα δεύτερο \`❓ Other\` ticket.**`)
          .setTimestamp()
          .setColor('#000000'))).catch(channel =>{
            console.log(channel.message)
          })
          const data = await db.get(`tickets_${menu.message.guild.id}`)
          if(data == null) await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: 1})
        const partnerchannel = await  menu.guild.channels.create(`❓ticket-${'0'.repeat(4 - data.TicketNumber.toString().length)}${data.TicketNumber}`, {
            
            type: "text", 
                       parent: menu.message.channel.parentID, 
            
                permissionOverwrites: [
                   {
                   id: menu.guild.roles.everyone, 
                   deny: ['VIEW_CHANNEL'] 
                   },
                  {
                    id: menu.clicker.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                 },
                   {
                     id: config['staff team role id'],
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                   },
                ],
                }) 
                const logs = menu.message.guild.channels.cache.get(config.ticket.logs)
                if(logs){
                  const embed = new Discord.MessageEmbed({
                    "author": {
                      "name": menu.clicker.user.tag,
                      "url": "https://discord.com/users/" + menu.clicker.user.id + "",
                      "icon_url": menu.clicker.user.displayAvatarURL()
                    },
                    "color": 3775833,
                    "description": "**Κανάλι: [`" + partnerchannel.name + "`](https://canary.discord.com/channels/" + menu.message.guild.id + "/" + partnerchannel.id + ") • `" + partnerchannel.id + "`\nMention: <@" + menu.clicker.user.id + ">**"
                  })
                  logs.send(embed)
                }
              await db.set(`${partnerchannel.id}`, menu.clicker.user.id)
                          await db.set(`tickets_${menu.message.guild.id}`, {TicketNumber: data.TicketNumber + 1})
                          
                          const mhnyma = new Discord.MessageEmbed()
               
                .setDescription(`<@${menu.clicker.user.id}> ,\n\n**Περιέγραψε αναλυτικά το πρόβλημα σου
Το πρώτο διαθέσιμο Staff θα σας εξυπηρετήσει άμεσα! **`)
                .setColor('#000000')
                const close1 = new MessageButton()
                        .setStyle("green")
                        .setLabel('🔒')
                        .setID("close")
                        const buttonarray = [close1]
                        partnerchannel.send({ embed: mhnyma, buttons: buttonarray})
  }
        
})
ketse.on('clickButton', async (button) => {
    const ticketChannel = button.message.channel
    
  if(button.id === 'close') {
       const chanel = db.get(button.message.channel.id)
    if(!chanel) return button.reply.defer().catch(()=>{});
    let usersd = await button.message.channel.permissionOverwrites.get(ketse.users.cache.get(chanel).id);
    let deleteButton = new MessageButton()
    .setLabel("Delete")
    .setID(`ticket_delete_${ticketChannel.id}`)
    .setEmoji("⛔")
    .setStyle("gray")
    if(!usersd) return button.reply.send(`\`${button.message.channel.name}\` is already closed`, { component: deleteButton, ephemeral: true})
  
        const dfa = button.clicker.user
        let buttonMember = button.clicker.member;
  
    let e = await button.message.channel.send("Are you sure you would like to close this ticket?", {component: new MessageActionRow().addComponent(new MessageButton().setLabel("Close").setStyle("red").setID("delete")).addComponent(new MessageButton().setLabel("Cancel").setStyle("grey").setID("cancel"))});
    let filter = (button) => buttonMember.user.id == button.clicker.user.id
    let collector = e.createButtonCollector(filter, { max: 1, time: 60000, errors: ["time"] })
    button.reply.defer().catch(()=>{});
  
    collector.on("collect", async button => {
        if(button.id == `delete`) {
            e.delete().catch(()=>{});
  
            let closedEmbed = new Discord.MessageEmbed({
              "color": 3026739,
              "description": "```Support team ticket controls```"
            })
  
            let reopen = new MessageButton()
                .setLabel("Open")
                .setID(`ticket_reopen_${ticketChannel.id}`)
                .setEmoji("🔓")
                .setStyle("gray")
           
            let deleteButton = new MessageButton()
                .setLabel("Delete")
                .setID(`ticket_delete_${ticketChannel.id}`)
                .setEmoji("⛔")
                .setStyle("gray")
  
  
  
        button.message.channel.send({embed: new Discord.MessageEmbed({
          "color": 16514607,
          "description": "Ticket Closed by <@" + button.clicker.user.id + ">"
        })})
        button.message.channel.send("", {embed: closedEmbed, components: new MessageActionRow()
          .addComponent(reopen)
          .addComponent(deleteButton)
          })
            const logs = button.message.guild.channels.cache.get(config.ticket.logs)
            if(logs){
        logs.send(new Discord.MessageEmbed({
        "author": {
          "name": ketse.users.cache.get(chanel).tag,
          "url": "https://discord.com/users/" + ketse.users.cache.get(chanel).id,
          "icon_url": ketse.users.cache.get(chanel).displayAvatarURL()
        },
        "color": 15483204,
        "description": "**Κανάλι: `" + button.message.channel.name + "` • `" + button.message.channel.id + "`\nMention: <@" + ketse.users.cache.get(chanel).id + ">\nΑπό τον/ην: <@" + button.clicker.user.id + ">**"
        }))
        await button.message.channel.setName(`${button.message.channel.name.slice(0, 2)}closed-${button.message.channel.name.split('-')[1]}`)//to username tou ticket
        button.reply.defer();
  
        
      
        usersd.delete().catch(()=>{});
        
            }
          } else {
            e.delete().catch(()=>{});
        }
    })
  
  
  
  } 
  if(button.id === `ticket_reopen_${ticketChannel.id}`){
    const chanel = db.get(button.message.channel.id)
      if(!chanel) return button.reply.defer().catch(()=>{}), button.message.channel.delete().catch(()=>{});
      button.reply.defer();
      await ticketChannel.updateOverwrite(ketse.users.cache.get(chanel).id, { VIEW_CHANNEL: true })
    button.message.channel.send(new Discord.MessageEmbed({
      "color": 2015834,
      "description": "Ticket Opened by <@" + button.clicker.user.id + ">"
    }))
    const logs = button.message.guild.channels.cache.get(config.ticket.logs)
    if(logs){
  logs.send(new Discord.MessageEmbed({
  "author": {
  "name": ketse.users.cache.get(chanel).tag,
  "url": "https://discord.com/users/" + ketse.users.cache.get(chanel).id,
  "icon_url": ketse.users.cache.get(chanel).displayAvatarURL()
  },
  "color": 16514607,
  "description": "**Κανάλι: `" + button.message.channel.name + "` • `" + button.message.channel.id + "`\nMention: <@" + ketse.users.cache.get(chanel).id + ">\nΑπό τον/ην: <@" + button.clicker.user.id + ">**"
  }))
  await button.message.channel.setName(`${button.message.channel.name.slice(0, 2)}ticket-${button.message.channel.name.split('-')[1]}`)//to username tou ticket
    }
  
    button.message.delete().catch(()=>{});
  }
  if(button.id === `ticket_delete_${ticketChannel.id}`){
    button.message.channel.delete().catch(()=>{});
  }
    if (button.id === 'online') {
        const status = db.get(`time_${button.guild.id}_${button.clicker.user.id}`)
        if (status) return button.reply.send({
            embed: new Discord.MessageEmbed({
                "description": "**<:ketse:" + config.livestatus.online + ">Η κατάσταση σου είναι ήδη ενεργή<:ketse:" + config.livestatus.online + ">**",
                "color": button.guild.members.cache.get(button.clicker.user.id).displayHexColor,
                "author": {
                    "name": button.clicker.user.username,
                    "url": "https://discord.com/users/" + button.clicker.user.id,
                    "icon_url": button.clicker.user.displayAvatarURL()
                }
            }), ephemeral: true
        })
        if (!status) {
            button.reply.send({
                embed: new Discord.MessageEmbed({
                    "description": "**<:ketse:" + config.livestatus.online + ">Η κατάσταση σου είναι ενεργή<:ketse:" + config.livestatus.online + ">**",
                    "color": button.guild.members.cache.get(button.clicker.user.id).displayHexColor,
                    "author": {
                        "name": button.clicker.user.username,
                        "url": "https://discord.com/users/" + button.clicker.user.id,
                        "icon_url": button.clicker.user.displayAvatarURL()
                    }
                }), ephemeral: true
            })

            db.set(`time_${button.guild.id}_${button.clicker.user.id}`, new Date().getTime())
        }
    }
    if (button.id === 'offline') {
        const status = db.get(`time_${button.guild.id}_${button.clicker.user.id}`)
        if (!status) return button.reply.send({
            embed: new Discord.MessageEmbed({
                "description": "**<:ketse:" + config.livestatus.offline+ ">Η κατάσταση σου είναι ήδη ανενεργή<:ketse:" + config.livestatus.offline+ ">**",
                "color": button.guild.members.cache.get(button.clicker.user.id).displayHexColor,
                "author": {
                    "name": button.clicker.user.username,
                    "url": "https://discord.com/users/" + button.clicker.user.id,
                    "icon_url": button.clicker.user.displayAvatarURL()
                }
            }), ephemeral: true
        })
        if (status) {
            const fasdf = new MessageButton()
                .setID(`LEADERBOARD`)
                .setEmoji("⚡")
                .setStyle("grey");
            button.reply.send({
                embed: new Discord.MessageEmbed({
                    "description": "**<:ketse:" + config.livestatus.offline+ ">Η κατάσταση σου είναι ανενεργή<:ketse:" + config.livestatus.offline+ ">**",
                    "color": button.guild.members.cache.get(button.clicker.user.id).displayHexColor,
                    "author": {
                        "name": button.clicker.user.username,
                        "url": "https://discord.com/users/" + button.clicker.user.id,
                        "icon_url": button.clicker.user.displayAvatarURL()
                    },
                    "footer": {
                        "text": "Για να δεις τον συνολικό πίνακα τότε πάτα στο ⚡"
                    }
                }), components: new MessageActionRow().addComponent(fasdf), ephemeral: true
            })

            const df = new Date().getTime() - status;

            let hours = Math.floor(df / 3600000) % 24;
            let minutes = Math.floor(df / 60000) % 60;
            let seconds = Math.floor(df / 1000) % 60;
            if (hours) hours = `${hours}ω:`;
            if (minutes) minutes = `${minutes}λ:`;
            if (seconds) seconds = `${seconds}δ`;
            if (!hours) hours = "";
            if (!minutes) minutes = "";
            if (!seconds) seconds = "";
            button.guild.channels.cache.get(config.arena.logs).send({ embed: new Discord.MessageEmbed().setAuthor(button.clicker.user.username, button.clicker.user.displayAvatarURL(), `https://discord.com/users/${button.clicker.user.id}`).setColor("BLACK").setDescription(`**${ketse.users.cache.get(button.clicker.user.id)} έχει \`${hours}${minutes}${seconds}\`**`) })
            db.add(`hours_${button.guild.id}_${button.clicker.user.id}`, df)
            db.delete(`time_${button.guild.id}_${button.clicker.user.id}`)

        }
    }
    if (button.id === 'LEADERBOARD') {
        let arena = db.all().filter(data => data.ID.startsWith(`hours_${button.guild.id}`)).sort((a, b) => b.data - a.data)
        if (!arena) message.delete().catch(() => { });;
        if (arena !== null) {

            let content = "";

            for (let i = 0; i < arena.length; i++) {
                let user = ketse.users.cache.get(arena[i].ID.split('_')[2])
                let hours = Math.floor(arena[i].data / 3600000) % 24;
                let minutes = Math.floor(arena[i].data / 60000) % 60;
                let seconds = Math.floor(arena[i].data / 1000) % 60;
                if (hours) hours = `${hours}ω:`;
                if (minutes) minutes = `${minutes}λ:`;
                if (seconds) seconds = `${seconds}δ`;
                if (!hours) hours = ``;
                if (!minutes) minutes = ``;
                if (!seconds) seconds = ``;

                content += `**\`${i + 1}\`. ${user} έχει \`${hours}${minutes}${seconds}\`**\n`
            }


            const embed = new Discord.MessageEmbed()
                .setTitle(`**Activity Staff**`)
                .setDescription(content)

                .setColor(button.guild.members.cache.get(button.clicker.user.id).displayHexColor)

            button.reply.send({ embed: embed, ephemeral: true })
        }

    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})

function timeout(time, member, muteRole, message, reason, fasdf) {
  setTimeout(() => {
      member.roles.remove(muteRole)

      let embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription("**<@" + member.user.id + "> unmuted.\n\nΑπό τον/ην: <@" + fasdf.id + ">\nΛόγος: `" + reason + "`\nΔιάρκεια: `"+ time + "`**")
      return ketse.channels.cache.get(config.logs.mute).send(embed)

  }, ms(time))
}


async function createAPIMessage(interaction, content) {
  const apiMessage = await Discord.APIMessage.create(ketse.channels.resolve(interaction.channel_id), content)
      .resolveData()
      .resolveFiles();
  
  return { ...apiMessage.data, files: apiMessage.files };
}












ketse.login(config.token)