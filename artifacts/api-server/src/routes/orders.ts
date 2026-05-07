import { Router } from "express";
import nodemailer from "nodemailer";
import { db, ordersTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAdminAuth } from "./admin-auth";

const router = Router();

async function sendWhatsApp(phone: string, message: string, logger: any): Promise<void> {
  const token = process.env["WHATSAPP_TOKEN"];
  const phoneId = process.env["WHATSAPP_PHONE_ID"];
  if (!token || !phoneId) {
    logger.warn("WhatsApp credentials not configured — skipping WA message");
    return;
  }
  const cleanPhone = phone.replace(/\D/g, "");
  const argPhone = cleanPhone.startsWith("54")
    ? cleanPhone
    : `54${cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone}`;
  const body = {
    messaging_product: "whatsapp",
    to: argPhone,
    type: "text",
    text: { body: message },
  };
  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    logger.error({ err }, "WhatsApp API error");
  } else {
    logger.info({ to: argPhone }, "WhatsApp message sent");
  }
}

function buildWhatsAppMessage(opts: {
  fullName: string; product: string; priceDisplay: string;
  size: string; color: string; quantity: number;
}): string {
  return `¡Hola ${opts.fullName}! 👋

*KYRBIRT* — Gracias por elegirnos 🖤

Registramos tu pedido:
• *Prenda:* ${opts.product}
• *Colorway:* ${opts.color}
• *Talle:* ${opts.size}
• *Cantidad:* ${opts.quantity}
• *Total:* ${opts.priceDisplay}

───────────────────
💳 *MEDIOS DE PAGO*

*Transferencia / MercadoPago*
Alias: *kyrbirt.mp*
Titular: Juan Ignacio Guma

📢 Una vez realizado el pago, envianos el comprobante por este mismo chat para confirmar tu pedido.

*Rapipago / Pago Fácil*
Consultanos por este chat para enviarte el cupón de pago en efectivo.

───────────────────
📦 *DATOS DE ENVÍO*

Para coordinar el envío necesitamos que nos mandes los siguientes datos:

1️⃣ Nombre y apellido completo
2️⃣ DNI
3️⃣ Dirección (calle, número, piso/depto)
4️⃣ Código postal
5️⃣ Localidad y provincia
6️⃣ Teléfono de contacto

Una vez enviado el pedido te vamos a pasar el *código de seguimiento* para que puedas rastrear tu envío.

───────────────────
Ante cualquier consulta, estamos acá 🤙
*KYRBIRT* — instagram.com/kyrbirt`;
}

router.post("/orders/email", async (req, res) => {
  const { product, price, size, color, quantity, fullName, phone, email, comments } = req.body;
  const gmailUser = process.env["GMAIL_USER"];
  const gmailPass = process.env["GMAIL_APP_PASSWORD"];
  const priceDisplay = typeof price === "number" ? `$${price.toLocaleString("es-AR")}` : String(price);

  try {
    await db.insert(ordersTable).values({
      product: String(product),
      price: priceDisplay,
      size: String(size),
      color: String(color),
      quantity: Number(quantity) || 1,
      fullName: String(fullName),
      phone: String(phone),
      email: String(email),
      comments: comments ? String(comments) : null,
    });
    req.log.info({ product, fullName }, "Order saved to DB");
  } catch (err) {
    req.log.error({ err }, "Failed to save order to DB");
  }

  const waMessage = buildWhatsAppMessage({
    fullName: String(fullName), product: String(product), priceDisplay,
    size: String(size), color: String(color), quantity: Number(quantity) || 1,
  });
  sendWhatsApp(String(phone), waMessage, req.log).catch((err) =>
    req.log.error({ err }, "WhatsApp send failed")
  );

  const orderHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050505; color: #FFFEF7; padding: 32px;">
      <h1 style="font-size: 28px; letter-spacing: 4px; margin-bottom: 4px;">KYRBIRT</h1>
      <p style="color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">Nueva orden recibida</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Prenda</td><td style="padding: 12px 0; font-weight: bold;">${product}</td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Precio</td><td style="padding: 12px 0;">${priceDisplay}</td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Talle</td><td style="padding: 12px 0;">${size}</td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Colorway</td><td style="padding: 12px 0;">${color}</td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Cantidad</td><td style="padding: 12px 0;">${quantity}</td></tr>
      </table>
      <h2 style="font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 16px;">Datos del comprador</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Nombre</td><td style="padding: 12px 0;">${fullName}</td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Teléfono</td><td style="padding: 12px 0;"><a href="tel:${phone}" style="color: #FFFEF7;">${phone}</a></td></tr>
        <tr style="border-bottom: 1px solid #222;"><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Email</td><td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #FFFEF7;">${email}</a></td></tr>
        ${comments ? `<tr><td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Comentarios</td><td style="padding: 12px 0;">${comments}</td></tr>` : ""}
      </table>
      <p style="color: #444; font-size: 11px; text-align: center; margin-top: 32px;">kyrbirt.future@gmail.com — instagram.com/kyrbirt</p>
    </div>
  `;

  if (!gmailUser || !gmailPass) {
    req.log.warn("Email credentials not configured — order saved to DB but email not sent");
    return res.json({ ok: true, note: "credentials_missing" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });
    await transporter.sendMail({
      from: `KYRBIRT Store <${gmailUser}>`,
      to: ["kyrbirt.future@gmail.com", email],
      subject: `Nueva orden — ${product}`,
      html: orderHtml,
    });
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send order email");
    return res.json({ ok: true, note: "email_failed_order_saved" });
  }
});

router.get("/admin/orders", requireAdminAuth, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    return res.json(orders);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    return res.status(500).json({ error: "DB error" });
  }
});

export default router;
