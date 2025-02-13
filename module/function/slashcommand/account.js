module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "account"){
    const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id} LIMIT 1;`);

    if(!account[0]){
      await interaction.reply({ 
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録されていません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "以下のリンクから登録を行うことができます\n登録が完了すると[グローバルチャット利用規約](https://gc.taka.ml/)にも同意したものとみなします"
        }], 
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("サイトへ飛ぶ")
                .setURL("https://auth.taka.ml/")
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }else{
      await interaction.reply({ 
        embeds:[{
          color: Colors.Green,
          author:{
            name: "登録情報",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `ID\n\`${account[0].id}\`\nIPアドレス\n\`${account[0].ip}\`\n登録日時/更新日時\n\`${new Date(account[0].time).toLocaleString()}\``
        }],
        ephemeral: true
      });
    }
  }
}