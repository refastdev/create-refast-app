import { Refast } from '@refastdev/refast';
import { i18n } from '@refastdev/refast/locale';
import { routes } from '@refastdev/refast/routes';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<Refast routes={{ ...routes, routerType: 'hash' }} i18n={i18n} />);
