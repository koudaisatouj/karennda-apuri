// functions/index.js
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Firestore への参照
const db = admin.firestore();

function sendJson(res, status, body) {
  res.set("Content-Type", "application/json");
  return res.status(status).send(JSON.stringify(body));
}

// �\��완�E�炵���ł悢 SMTP �ݒ� (環境変数に設定して使います)
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || smtpUser;

const mailer =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {user: smtpUser, pass: smtpPass},
    })
    : null;

async function sendReservationMail(to, payload) {
  if (!mailer || !to) return;
  const {userName, type, date, time, cardName, docId} = payload;
  const subject = `予約完了のお知らせ (${date || "-"})`;
  const body = [
    `${userName || "お客様"} 様`,
    "",
    "ご予約が完了しました。",
    `種類: ${type || "-"}`,
    `商品/タイトル: ${cardName || "-"}`,
    `日付: ${date || "-"}`,
    `時間: ${time || "-"}`,
    `予約ID: ${docId || "-"}`,
    "",
    "このメールにお心当たりがない場合は破棄してください。",
  ].join("\n");

  await mailer.sendMail({
    from: mailFrom,
    to,
    subject,
    text: body,
  });
}

// ★ 既存：Callable Function（そのまま残す）
exports.addNumbers = functions.https.onCall((data, context) => {
  const a = data.a;
  const b = data.b;

  return {
    result: a + b,
    msg: "計算完了！",
  };
});

// ★ 追加①：IDトークンを検証する共通関数
async function verifyFirebaseIdToken(req, res) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    res.status(401).json({
      error: "Authorization ヘッダーがありません",
    });
    return null;
  }

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.error(err);
    res.status(401).json({
      error: "トークンが無効です",
    });
    return null;
  }
}

// ★ 追加②：認証付き 予約登録 API
exports.createReservation = functions.https.onRequest(
    async (req, res) => {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const decodedToken = await verifyFirebaseIdToken(req, res);
      if (!decodedToken) {
        return;
      }

      try {
        const data = req.body;

        if (!data.date || !data.time || !data.type) {
          return res.status(400).json({
            error: "?K?{?????????????",
          });
        }

        const uid = decodedToken.uid;
        const email = data.email || decodedToken.email;

        const docRef = await db.collection("reservations").add({
          uid,
          userName: data.userName || email,
          type: data.type,
          title: data.title || "",
          date: data.date,
          time: data.time,
          cardCount: data.cardCount || 0,
          status: "?\????",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        try {
          await sendReservationMail(email, {
            userName: data.userName || email,
            type: data.type,
            date: data.date,
            time: data.time,
            cardName: data.title || data.cardName,
            docId: docRef.id,
          });
        } catch (mailErr) {
          console.error("?\?????????s???????", mailErr);
        }

        return res.status(201).json({
          id: docRef.id,
          message: "?\???o?^???????",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: "サーバーエラー",
        });
      }
    },
);

// �� �ǉ��B�F�F�ؕt�� ���O�C��� API (Firestore accounts �Œ�ׂẴ��[�U�[��/�p�X���[�h��ځAAuth�ɃA�N�Z�X���ĂԂ�)
exports.login = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const {userName, password} = req.body || {};
    if (!userName || !password) {
      return res.status(400).send("Missing userName or password");
    }

    const snap = await db.collection("accounts")
        .where("username", "==", userName)
        .where("password", "==", password)
        .limit(1)
        .get();
    if (snap.empty) {
      return sendJson(res, 401, {ok: false, message: "Invalid credentials"});
    }

    // Auth にユーザーがいなければ作成
    try {
      await admin.auth().getUser(userName);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        await admin.auth().createUser({uid: userName, displayName: userName});
      } else {
        throw err;
      }
    }

    const token = await admin.auth().createCustomToken(userName);
    return sendJson(res, 200, {ok: true, userName, token});
  } catch (err) {
    console.error("Error login", err);
    return res.status(500).send("Error login");
  }
});

// �� �ǉ��C�F�F�ؕt�� ���O�A�E�g API（サーバー側では状態を持たないため成功のみ返す）
exports.logout = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    return sendJson(res, 200, {ok: true});
  } catch (err) {
    console.error("Error logout", err);
    return res.status(500).send("Error logout");
  }
});