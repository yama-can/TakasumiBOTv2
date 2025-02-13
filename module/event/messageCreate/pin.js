module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const limit = require("../../lib/limit");
    
  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ManageMessages)
  ) return;
    
  const channel = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
  if(channel[0]){
    if(limit(message)) return;
    try{
      const before = await message.client.channels.cache.get(channel[0].channel).messages.fetch({"message":channel[0].message})
      before.delete();
      const after = await message.channel.send({
        embeds:[{
          color: Colors.Green,
          author:{
            name: before.embeds[0].author.name,
            icon_url: before.embeds[0].author.iconURL,
          },
          description: before.embeds[0].description,
          footer:{
            text: "TakasumiBOT PIN"
          }
        }]
      });
      await db(`UPDATE pin SET message="${after.id}" WHERE channel=${message.channel.id};`);
    }catch{
      const server = await db(`SELECT * FROM pin WHERE server = ${message.guild.id};`);
      server.forEach(data=>{
        db(`UPDATE pin SET count=${Number(data.count)-1} WHERE server=${message.guild.id};`);
      });
      await db(`DELETE FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    }
  }
}  