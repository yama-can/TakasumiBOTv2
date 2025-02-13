module.exports = async(member)=>{
  const { WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");

  const data = await db(`SELECT * FROM \`leave\` WHERE server = ${member.guild.id} LIMIT 1;`);
  if(data[0]){
    const msg = data[0].message
      .replace("[User]",`<@${member.user.id}>`)
      .replace("[UserName]",`${member.user.tag}`)
      .replace("[UserID]",`${member.user.id}`)
      .replace("[ServerName]",`${member.guild.name}`)
      .replace("[ServerID]",`${member.guild.id}`)
      .replace("[Count]",`${member.guild.memberCount}`)
      .replace("@everyone","＠everyone")
      .replace("@here","＠here")
      
      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
      await webhook.send({
        content: msg,
        username: "TakasumiBOT Leave",
        avatarURL: "https://cdn.taka.ml/images/icon.png"
      })
        .catch(async(error)=>{
          await db(`DELETE FROM \`leave\` WHERE channel = ${data[0].channel} LIMIT 1;`);
          await member.client.channels.cache.get(data[0].channel).send({
            embeds:[{
              author:{
                name: "退出メッセージでエラーが発生しました",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              color: Colors.Red,
              description: "エラーが発生したため、強制的に無効にされました",
              fields:[
                {
                  name: "エラーコード",
                  value: `\`\`\`${error}\`\`\``
                }
              ]
            }],
            components:[
              new ActionRowBuilder()
                .addComponents( 
                  new ButtonBuilder()
                    .setLabel("サポートサーバー")
                    .setURL("https://discord.gg/NEesRdGQwD")
                    .setStyle(ButtonStyle.Link))
            ]
          }).catch(()=>{});
        });
  }
}