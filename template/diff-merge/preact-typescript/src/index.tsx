import { Refast } from '@refastdev/refast';
import { i18n } from '@refastdev/refast/locale';
import { routes } from '@refastdev/refast/routes';
import { render } from 'preact'

const root = document.getElementById('root') as HTMLElement;
render(<Refast routes={routes} i18n={i18n} />, root);
