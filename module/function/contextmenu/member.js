module.exports = async(interaction)=>{
  const db = require("../../lib/db");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "View Member Information"){
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

    const members = await db(`SELECT * FROM account WHERE id = ${member.user.id} LIMIT 1;`);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${member.user.tag}の検索結果`,
          url: `https://discord.com/users/${member.user.id}`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        thumbnail:{
          url: member.user.avatarURL({extension:"png",forceStatic:false,size:1024})||member.user.defaultAvatarURL
        },
        fields:[
          {
            name: "ID",
            value: member.user.id,
            inline: true
          },
          {
            name: "ニックネーム",
            value: member.nickname||"未設定",
            inline: true
          },
          {
            name: "作成日時",
            value: `${new Date(member.user.createdTimestamp).toLocaleString()}\n(${Math.round((Date.now() - member.user.createdAt) / 86400000)}日前)`,
            inline: true
          },
          {
            name: "参加日時",
            value: `${new Date(member.joinedTimestamp).toLocaleString()}\n(${Math.round((Date.now() - member.joinedAt) / 86400000)}日前)`,
            inline: true
          },
          {
            name: "アカウントの種類",
            value: member.user.bot ? "BOT" : "ユーザー",
            inline: true
          },
          {
            name: "TakasumiBOT Accountへの登録",
            value: members[0] ? "登録済み" : "未登録"
          },
          {
            name: "ロール",
            value: member.roles.cache.map(r=>r).join("")
          }
        ],
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date()
      }]
    })
    .catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
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
      })
    });
  }
}