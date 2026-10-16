import type { APIRoute } from 'astro';

export const prerender = false;

const MAX = { name: 100, email: 200, subject: 200, message: 5000 };
// Un humain met plus de 3 secondes à remplir le formulaire.
const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { name: string; email: string; subject: string; message: string; lang: 'fr' | 'en' };

function field(data: FormData, key: string): string {
	const value = data.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function respond(request: Request, lang: string, status: 'ok' | 'error' | 'invalid', code: number) {
	// Sans JavaScript, le navigateur poste le formulaire directement : on le renvoie sur la page.
	if (request.headers.get('accept')?.includes('application/json')) {
		return new Response(JSON.stringify({ status }), {
			status: code,
			headers: { 'content-type': 'application/json' },
		});
	}
	const page = lang === 'en' ? '/en/contact/' : '/contact/';
	return new Response(null, { status: 303, headers: { location: `${page}?status=${status}#contact-form` } });
}

async function sendEmail(f: Fields): Promise<boolean> {
	const apiKey = import.meta.env.RESEND_API_KEY;
	const to = import.meta.env.CONTACT_TO_EMAIL;
	const from = import.meta.env.CONTACT_FROM_EMAIL || 'The Optimization Guy <onboarding@resend.dev>';
	if (!apiKey || !to) {
		console.error('[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL manquant');
		return false;
	}

	const text = [
		`Nom : ${f.name || '(non renseigné)'}`,
		`E-mail : ${f.email}`,
		`Langue : ${f.lang}`,
		'',
		f.message,
	].join('\n');

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: f.email,
			subject: `[Contact blog] ${f.subject || 'Nouveau message'}`,
			text,
		}),
	});
	if (!res.ok) {
		console.error('[contact] Resend a répondu', res.status, await res.text());
		return false;
	}
	return true;
}

export const POST: APIRoute = async ({ request }) => {
	let data: FormData;
	try {
		data = await request.formData();
	} catch {
		return respond(request, 'fr', 'invalid', 400);
	}

	const lang = field(data, 'lang') === 'en' ? 'en' : 'fr';

	// Anti-spam : champ piège invisible rempli, ou formulaire envoyé trop vite.
	// On répond "ok" pour ne rien apprendre au robot.
	const startedAt = Number(field(data, 'started_at'));
	if (field(data, 'website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
		return respond(request, lang, 'ok', 200);
	}

	const f: Fields = {
		name: field(data, 'name'),
		email: field(data, 'email'),
		subject: field(data, 'subject'),
		message: field(data, 'message'),
		lang,
	};

	if (
		!EMAIL_RE.test(f.email) ||
		f.message.length < 10 ||
		f.name.length > MAX.name ||
		f.email.length > MAX.email ||
		f.subject.length > MAX.subject ||
		f.message.length > MAX.message
	) {
		return respond(request, lang, 'invalid', 400);
	}

	try {
		const sent = await sendEmail(f);
		return sent ? respond(request, lang, 'ok', 200) : respond(request, lang, 'error', 502);
	} catch (err) {
		console.error('[contact] échec envoi', err);
		return respond(request, lang, 'error', 502);
	}
};
