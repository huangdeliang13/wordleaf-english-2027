# wordleaf-english-2027
拾词：2027 广东专插本公共英语背词与间隔复习网站。不登录时保存在本机，邮箱登录后可通过私人 Supabase 数据库跨设备合并。

词库更新：按教育部 2021 年课程标准附录整理 3000 个词目，拆分并列形式并去重后 3048 张课标卡片，另保留 20 张起步补充卡片，共 3068 张。参考已检索到的 2026 年公共英语要求；不是尚未核实的“2027 官方词库”。

背词时先选择“认识 / 模糊 / 忘了”再显示释义，确认进入下一词后保存反馈；查看答案本身不会添加学习记录。已有英文例句可点击朗读，使用浏览器自带英文语音。例句并非覆盖每个词。

云同步同步个人词库、已确认的记忆反馈、收藏和学习偏好，不同步进行中的练习轮次。首次登录询问是否合并本机旧记录；账号分开缓存，不覆盖原本机存档。离线可背词，联网后合并；CAS 版本检查避免两个设备直接覆盖，收藏取消也会传播。

后台需要创建 `wordleaf_profiles`、账号隔离 RLS 和 `wordleaf_sync` 接口。浏览器仅使用 publishable key；绝不放入 service-role/secret key。固定 Supabase JS 2.117.3 的校验与来源见 `supabase-sdk.lock.json`，MIT 授权见 `SUPABASE-LICENSE.txt`。

邮箱注册需要确认邮件。部署时须在 Supabase Authentication → URL Configuration 中把 Site URL 设置为线上网站地址，并添加同一地址至 Redirect URLs。默认邮件服务仅发给项目成员邮箱；其他邮箱需要配置 SMTP。不要通过关闭验证来绕过邮件限制。

来源、版本和整理方式见 [vocabulary-sources.md](./vocabulary-sources.md)。部分释义使用 MIT 授权 ECDICT 数据，授权全文见 [ECDICT-LICENSE.txt](./ECDICT-LICENSE.txt)。
