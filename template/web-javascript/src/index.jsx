import { Refast } from '@refastdev/refast';
import { routes } from '@refastdev/refast/routes';
import { createRoot } from 'react-dom/client';

import './css/index.css';

const root = document.getElementById('root');
createRoot(root).render(<Refast routes={routes} />);
