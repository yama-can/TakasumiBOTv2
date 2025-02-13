module.exports = async(interaction)=>{
  const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "panel"){
    const title = interaction.options.getString("title")||"役職パネル";
    const role_1 = interaction.options.getRole("role_1");
    const role_2 = interaction.options.getRole("role_2");
    const role_3 = interaction.options.getRole("role_3");
    const role_4 = interaction.options.getRole("role_4");
    const role_5 = interaction.options.getRole("role_5");
    const role_6 = interaction.options.getRole("role_6");
    const role_7 = interaction.options.getRole("role_7");
    const role_8 = interaction.options.getRole("role_8");

    const emojis = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭"];
    const selects = [role_1,role_2,role_3,role_4,role_5,role_6,role_7,role_8]
      .filter(role=>role!==null)

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageRoles)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージの送信\nロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      await interaction.channel.send({
        embeds:[{
          color: Colors.Green,
          title: title,
          description: selects.map((c,i)=>`${emojis[i]}<@&${c.id}>`).join("\n")
        }],
        components:[     
          new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("role")
                .setPlaceholder("ロールが選択されていません")
                .setMinValues(0)
                .setMaxValues(selects.length)
                .addOptions(
                  selects.map((c,i)=>({
                    label: `@${c.name}`,
                    value: c.id,
                    emoji:{
                      name: emojis[i]
                    }
                  }))
                ))
        ]
      });

      await interaction.deferReply()
        .then(()=>interaction.deleteReply())
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "同じロールが選択されているか、BOTの権限が不足しています",
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