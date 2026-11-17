import { registerStrings, t, applyStrings } from '../core/i18n.js';
import de from './de.js';

// Site root, derived from this module so the page works under any base URL.
const ROOT = new URL('../../../', import.meta.url);

registerStrings(de);
applyStrings();
renderProject(await (await fetch(new URL('data/project.json', ROOT))).json());

// All project facts come from data/project.json; nothing about the project is written in this file.
function renderProject(project) {
  for (const el of document.querySelectorAll('[data-p]')) el.textContent = project[el.dataset.p].value;

  for (const ul of document.querySelectorAll('[data-list]')) {
    for (const text of project[ul.dataset.list].items) {
      ul.append(Object.assign(document.createElement('li'), { textContent: text }));
    }
  }

  const partners = document.getElementById('partners');
  for (const partner of project.partners.items) {
    const li = Object.assign(document.createElement('li'), { textContent: partner.name });
    if (partner.role) li.append(' ', Object.assign(document.createElement('span'), { className: 'role', textContent: partner.role }));
    partners.append(li);
  }

  document.getElementById('funding-line').textContent = t('partner.funding', {
    funder: project.funder.short,
    agency: project.projectAgency.short,
    fkz: project.fkz.value,
  });

  const logo = document.getElementById('funding-logo');
  logo.src = new URL(project.images.fundingLogo.file, ROOT);
  logo.alt = project.images.fundingLogo.alt;

  for (const figure of document.querySelectorAll('figure[data-img]')) {
    const image = project.images[figure.dataset.img];
    const img = Object.assign(document.createElement('img'), {
      alt: image.caption, width: image.width, height: image.height,
    });
    const caption = document.createElement('figcaption');
    caption.append(image.caption, Object.assign(document.createElement('span'), {
      className: 'credit',
      textContent: image.credit,
    }));
    img.src = new URL(image.file, ROOT);
    figure.append(img, caption);
  }
}
