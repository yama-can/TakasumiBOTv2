module.exports = async(interaction)=>{
  const permission = require("../../lib/permission");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "View Permissions"){
    const member = interaction.options.getMember("user");

    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定したユーザーが存在していないか、サーバーから退出しています"
      }],
      ephemeral: true
    });

    try{
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${member.user.tag}の権限`,
            url: `https://discord.com/users/${member.user.id}`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `\`${permission(member.permissions.toArray()).join("`,`")}\``,
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "権限を表示できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
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
        ],
        ephemeral: true
      });
    }
  }
}