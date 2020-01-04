import { ModalViewsBuilder } from "./modalViewsBuilder";

const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver
});

// Health Check Endpoint
receiver.app.get('/', (_, res) => {
  res.status(200).send();
});

// コマンド起動をリッスン
app.command('/addreminder', ({ ack, payload, context }) => {
  // コマンドのリクエストを確認
  ack();
  const views = ModalViewsBuilder.standardViews()

  try {
    const result = app.client.views.open({
      token: context.botToken,
      // 適切な trigger_id を受け取ってから 3 秒以内に渡す
      trigger_id: payload.trigger_id,
      // view の値をペイロードに含む
      view: views
    });
    console.debug(result);
  }catch (error) {
    console.error(error);
  }
});

// モーダルビューでのデータ送信イベントを処理します
app.view('view_1', async ({ ack, body, view, context, }) => {
  // モーダルビューでのデータ送信イベントを確認
  ack();
  console.debug(context);

  const timePattern: RegExp = /([0-1][0-9]|2[0-3]):[0-5][0-9]/
  // [state][values][block_id][action_id] でinputされた値を取り出す
  const date = view['state']['values']['date']['date']['selected_date'];
  const time = view['state']['values']['time']['time']['value'];
  const text = view['state']['values']['text']['text']['value'];
  const user = body['user'];

  // バリデーション 時刻が正規表現にマッチするか確認
  if (!timePattern.test(time)) {
    const resultNotification = app.client.chat.postMessage({
      token: context.botToken,
      channel: user.id,
      text: `追加できなかった :sweat_drops:\n時刻には00:00~23:59までの値を入力してね`
    });
    console.debug(resultNotification);
    return
  }

  const reminderTime = new Date(`${date} ${time}`)
  const reminderTimeUnix = reminderTime.getTime() / 1000

  // バリデーション 時刻が未来の日時になっているかどうか確認
  if (reminderTime < new Date()) {
    const resultNotification = app.client.chat.postMessage({
      token: context.botToken,
      channel: user.id,
      text: `追加できなかった :sweat_drops:\n リマインダーには未来の日時を設定してね`
    });
    console.debug(resultNotification);
    return
  }

  try {
    // reminder を追加
    const result = app.client.reminders.add({
      token: process.env.SLACK_USER_TOKEN,
      time: reminderTimeUnix,
      user: user.id,
      text: text
    })
    console.debug(result)
    // 通知
    const resultNotification = app.client.chat.postMessage({
      token: context.botToken,
      channel: user.id,
      text: `${date} ${time} にリマインダーをセットしたよ！`
    });
    console.debug(resultNotification);
  } catch(error) {
    console.error(error);
    const resultNotification = app.client.chat.postMessage({
      token: context.botToken,
      channel: user.id,
      text: `ごめんね、できなかったみたい...`
    });
    console.error(resultNotification);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();