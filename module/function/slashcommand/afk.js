module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "afk"){
    const message = interaction.options.getString("message")||"メッセージはありません";
    
    if(message.length>300) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メッセージが長すぎます",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "300文字未満になるように調整してください"
      }],
      ephemeral: true
    });

    const data = await db(`SELECT * FROM afk WHERE user = ${interaction.user.id} LIMIT 1;`);
    if(data[0]){
      await db(`DELETE FROM afk WHERE user = ${interaction.user.id} LIMIT 1;`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "AFKを無効にしました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `メンションは${data[0].mention}件ありました\n${time(new Date()-new Date(data[0].time))}秒間AFKでした`
        }]
      }); 
    }else{
      await db(`INSERT INTO afk (user, message, mention, time) VALUES("${interaction.user.id}","${message}","0",NOW());`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "AFKを有効にしました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          }
        }]
      });
    }
  }
}