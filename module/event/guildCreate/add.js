module.exports = async(guild)=>{
  const { ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  let find = 0;
  guild.channels.cache.map((channel)=>{
    if(find === 0){
      if(
        channel.type === ChannelType.GuildText&&
        guild.members.me.permissionsIn(channel).has(PermissionFlagsBits.ViewChannel)&&
        guild.members.me.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)
      ){
        channel.send({
          embeds:[{
            color: Colors.Green,
            thumbnail:{
              url: "https://cdn.taka.ml/images/bot.png"
            },
            title: "BOT導入ありがとうございます!",
            description: "やっほー。TakasumiBOTだよ\n便利な機能を備えた万能BOTです\n\nグローバルチャット、役職パネル、認証機能などいろいろあるよ!\nコマンドのhelpを表示する時は`/help`を実行してね\n`/follow`を実行するとBOTのアナウンスチャンネルが追加できます",
            footer:{
              text: `導入数:${guild.client.guilds.cache.size}サーバー`
            },
            timestamp: new Date()
          }],
          components:[
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
              .addComponents(
                new ButtonBuilder()
                  .setLabel("For English")
                  .setCustomId("english")
                  .setStyle(ButtonStyle.Primary))
          ]
        });
        return find = 1;
      }
    }
  });
}