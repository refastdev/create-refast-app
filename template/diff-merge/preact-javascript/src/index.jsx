import { Refast } from '@refastdev/refast';
import { routes } from '@refastdev/refast/routes';
import { render } from 'preact';

import './css/index.css';

const root = document.getElementById('root');
render(<Refast routes={routes} />, root);
