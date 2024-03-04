import { Refast } from '@refastdev/refast';
import { i18n } from '@refastdev/refast/locale';
import { routes } from '@refastdev/refast/routes';
import { createRoot } from 'react-dom/client';

import './styles/app.css';

const root = document.getElementById('root');
createRoot(root).render(<Refast routes={routes} i18n={i18n} />);
