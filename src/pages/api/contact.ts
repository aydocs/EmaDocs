import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof message !== 'string' || !message.trim()
    ) {
      return new Response(
        JSON.stringify({ error: 'Lütfen tüm alanları doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Nodemailer transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail uygulama şifresi
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'alici@example.com', // Mesajın gideceği mail adresi
      subject: 'Yeni İletişim Formu Mesajı',
      text: `Ad: ${name}\nE-posta: ${email}\nMesaj:\n${message}`,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Mesajınız başarıyla gönderildi!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
