module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "warn"){
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
      
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```サーバーの管理```"
          }
        ]
      }],
      ephemeral: true
    });
  
    const member = await interaction.guild.members.cache.get(user.id);
    if(!member) return await interaction.reply({
      embeds:[{
        author:{
          name: "警告できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "指定したユーザーが取得できません"
      }],
      ephemeral: true
    });
  
    if(member.user.id === interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "警告できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "自分自身を警告することはできません"
      }],
      ephemeral: true
    });
  
    await member.user.send({
      embeds:[{
        author:{
          name: "警告されました",
          icon_url: "https://cdn.taka.ml/images/system/warn.png"
        },
        description: reason,
        footer:{
          text: `${interaction.guild.name}(${interaction.guild.id})`,
          icon_url: interaction.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
        },
        timestamp: new Date(),
        color: "YELLOW"
      }]
    })
      .then(async()=>{
        await interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            author:{
              name: `${member.user.tag}を警告しました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            description: `理由: ${reason}`,
            color: Colors.Green
          }]
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "警告できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "ユーザーがDMを拒否しているか、メンバーが正しく指定されていません",
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
                  .setStyle("LINK"))
          ],
          ephemeral: true
        });
      })
  }
}